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
		getSelectTestsolveAnswers,
		getSelectTestsolvers,
		getTestCoordinators,
		getTestInfo,
		getTestsolveTestsolveAnswers,
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
				answers = await getTestsolveTestsolveAnswers(loadedTestsolve.id);
				feedbackAnswers = await getSelectTestsolveAnswers(loadedTestsolve.id);
				timeOffset = loadedTestsolve.time_elapsed;
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

			// time elapsed in seconds
			const timeElapsed = Math.floor((endTime - startTime) / 1000) + timeOffset;

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

			await fetch("/api/discord-dm", {
				method: "POST",
				body: JSON.stringify({
					userId: testCoordinator.coordinator_id,
					message:
						"Testsolve has been completed by " +
						userInfo.full_name +
						" on test " +
						testInfo.test_name,
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
	<div class="timer">
		<p>Time elapsed: {formatTime(timeElapsed, { hideHours: true })}</p>
		<Button action={saveTestsolve} title="Save" bwidth="100%" />
		<div style="height: 5px" />
		<Button
			action={() => {
				submitTestsolve(true);
			}}
			title="Submit"
			bwidth="100%"
		/>
	</div>
{/if}

<style>
	.timer {
		position: fixed;
		right: 0;
		top: 0;
		margin: 10px;
		padding: 10px;
		background-color: var(--text-color-light);
		border: 1px solid black;
	}
</style>
