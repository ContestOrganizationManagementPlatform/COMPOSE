<script lang="ts">
	import { page } from "$app/stores";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import { onDestroy } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		addProblemTestsolveAnswer,
		checkPriorTestsolve,
		getFeedbackQuestions,
		getTestsolveFeedbackAnswers,
		getSelectTestsolvers,
		getTestCoordinators,
		getTestInfo,
		getTestsolveProblemFeedback,
		getThisUser,
		getThisUserRole,
		getUser,
		insertTestsolve,
		insertTestsolveFeedbackAnswers,
		updateTestsolve,
		updateTestsolveAnswer,
		updateTestsolveFeedbackAnswers,
	} from "$lib/supabase";

	let loading = true;
	let disallowed = true;

	let answers = [];
	let feedbackQuestions = {};
	let feedbackAnswers = [];

	let startTime = null;
	let timeOffset = 0; // seconds to add to timer
	let endTime = null;
	import scheme from "$lib/scheme.json";

	// if a user has a previously uncompleted testsolve, load it
	let loadedTestsolve = null;

	let user;
	(async () => {
		user = await getThisUser();
	})();

	async function getAllFeedbackQuestions() {
		try {
			const test_feedback_questions = await getFeedbackQuestions(
				Number($page.params.id)
			);
			for (const x of test_feedback_questions) {
				feedbackQuestions[x.id] = x;
				feedbackAnswers.push({
					feedback_question: x.id,
					answer: "",
				});
			}
		} catch (error) {
			if (error.code !== "PGRST116") {
				handleError(error);
				toast.error(error);
			}
		}
	}

	async function permissionCheck() {
		try {
			// check permission
			if ((await getThisUserRole()) >= 40) {
				disallowed = false;
			} else {
				const count = await getSelectTestsolvers(
					Number($page.params.id),
					user.id
				);
				if (count > 0) {
					disallowed = false;
				}
			}

			await loadTestsolve();

			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function loadTestsolve() {
		try {
			await getAllFeedbackQuestions();

			// check if there is a prior testsolve
			const loadedTestsolve = await checkPriorTestsolve(
				Number($page.params.id),
				user.id,
				false
			);

			if (loadedTestsolve.length > 0) {
				answers = await getTestsolveProblemFeedback(loadedTestsolve[0].id);
				feedbackAnswers = await getTestsolveFeedbackAnswers(
					loadedTestsolve[0].id
				);
				console.log("ANSWERS", answers, feedbackAnswers);
				timeOffset = loadedTestsolve[0].time_elapsed;
			}

			startTime = new Date();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	permissionCheck();

	async function submitTestsolve(completedSolve) {
		try {
			endTime = new Date();
			console.log(startTime);
			console.log("ENDTIME", endTime);
			// time elapsed in seconds
			const timeElapsed = Math.floor((endTime - startTime) / 1000) + timeOffset;
			console.log("ELAPSED", timeElapsed);
			let data;

			// fetch the current test version
			const testData = await getTestInfo(Number($page.params.id));

			// check if this is a resubmission
			if (loadedTestsolve) {
				data = await updateTestsolve(loadedTestsolve.id, {
					test_id: $page.params.id,
					solver_id: user.id,
					start_time: startTime.toISOString(),
					end_time: endTime.toISOString(),
					time_elapsed: timeElapsed,
					completed: completedSolve,
					test_version: testData.test_version,
				});
			} else {
				data = await insertTestsolve({
					test_id: $page.params.id,
					solver_id: user.id,
					start_time: startTime.toISOString(),
					end_time: endTime.toISOString(),
					time_elapsed: timeElapsed,
					completed: completedSolve,
					test_version: testData.test_version,
				});
				loading = false;
			}

			let testsolveId = data.id;

			// update all answers if previous testsolve, else insert
			if (loadedTestsolve) {
				for (const ans of answers) {
					await updateTestsolveAnswer(ans.id, {
						testsolve_id: testsolveId,
						problem_id: ans.problem_id,
						answer: ans.answer,
						feedback: ans.feedback,
						correct: ans.correct,
					});
				}
			} else {
				await addProblemTestsolveAnswer(
					answers.map((ans) => ({
						solver_id: user.id,
						testsolve_id: testsolveId,
						problem_id: ans.problem_id,
						answer: ans.answer,
						feedback: ans.feedback,
						correct: ans.correct,
					}))
				);
			}

			// update answer to feedback questions
			if (loadedTestsolve) {
				for (const ans of feedbackAnswers) {
					await updateTestsolveFeedbackAnswers(ans.id, {
						testsolve_id: testsolveId,
						feedback_question: ans.feedback_question,
						answer: ans.answer,
					});
				}
			} else {
				await insertTestsolveFeedbackAnswers(
					feedbackAnswers.map((ans) => ({
						testsolve_id: testsolveId,
						feedback_question: ans.feedback_question,
						answer: ans.answer,
					}))
				);
			}

			//Send DM to test coordinator
			const userInfo = await getUser(user.id);
			const testInfo = await getTestInfo(Number($page.params.id));
			const testCoordinator = await getTestCoordinators(
				Number($page.params.id)
			);

			const embed = {
				title: "Testsolve has been completed on test " + testInfo.test_name,
				//description: "This is the description of the embed.",
				type: "rich",
				color: parseInt(scheme.discord.embed_color, 16), // You can set the color using hex values
				author: {
					name: userInfo.full_name,
					//icon_url: "https://example.com/author.png", // URL to the author's icon
				},
				footer: {
					text: "COMPOSE",
					icon_url: scheme.logo, // URL to the footer icon
				},
			};

			const linkButton = {
				type: 2, // LINK button component
				style: 5, // LINK style (5) for external links
				label: "View Testsolve",
				url: scheme.url + "/testsolve/" + testsolveId, // The external URL you want to link to
			};

			await fetch("/api/discord/dm", {
				method: "POST",
				body: JSON.stringify({
					userId: testCoordinator.coordinator_id,
					message: "",
					embeds: [embed],
					components: [
						{
							type: 1,
							components: [linkButton],
						},
					],
				}),
			});

			//Redirect to another URL
			if (!completedSolve) {
				window.location.href = "/testsolve";
			} else {
				window.location.href = "/testsolve/" + testsolveId;
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function saveTestsolve() {
		submitTestsolve(false);
	}

	let timeElapsed = 0; // in ms

	function updateTimer() {
		if (!startTime) return;
		timeElapsed =
			new Date().getTime() - startTime.getTime() + timeOffset * 1000;
	}

	let timerInterval = setInterval(updateTimer, 1000);

	onDestroy(() => clearInterval(timerInterval));
</script>

<br />
{#if loading}
	<p>Loading...</p>
{:else if disallowed}
	<p>You are not a testsolver for this test!</p>
{:else}
	<TestView
		testId={$page.params.id}
		bind:answers
		answerable
		on:submit={submitTestsolve}
		{feedbackAnswers}
		{feedbackQuestions}
	/>
{/if}

<style>
</style>
