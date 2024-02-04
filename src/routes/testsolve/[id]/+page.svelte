<script lang="ts">
	import { page } from "$app/stores";
	import toast from "svelte-french-toast";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import Button from "$lib/components/Button.svelte";
	import { handleError } from "$lib/handleError";
	import {
		getFeedbackQuestions,
		removeTestsolver,
		getThisUserRole,
		getThisUser,
		getTestsolveFeedbackAnswers,
		getProblemFeedback,
		updateTestsolve,
		addProblemTestsolveAnswer,
		updateTestsolveFeedbackAnswers,
		getOneTestsolve,
		checkIfTestCoordinator,
		deleteTestsolveAnswer,
	} from "$lib/supabase";

	let loading = true;
	let disallowed = true;

	let answers = [];
	let feedbackQuestions = {};
	let feedbackAnswers = [];

	let startTime = null;
	let endTime = null;
	let isAdmin: boolean;

	let testsolve = null;
	let timeElapsed: number;
	$: timeElapsed =
		testsolve?.time_elapsed * 1000 ??
		new Date(testsolve?.end_time).getTime() -
			new Date(testsolve?.start_time).getTime();

	let user;
	(async () => {
		user = await getThisUser();
		await loadIsAdmin();
		console.log("Loaded isAdmin", isAdmin);
		await permissionCheck();
		console.log("Completed Perms Check 2");
		await getLocalFeedbackQuestions();
		console.log(feedbackQuestions, feedbackAnswers);
	})();

	async function getLocalFeedbackQuestions() {
		try {
			console.log("testsolve 2", testsolve);
			const test_feedback_questions = await getFeedbackQuestions(
				testsolve.test_id
			);
			console.log("TESTFEEDBACKQUESTIONS", test_feedback_questions);
			for (const x of test_feedback_questions) {
				console.log("hello");
				console.log(x);
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

	async function getFeedbackAnswers() {
		try {
			feedbackAnswers = await getTestsolveFeedbackAnswers(
				Number($page.params.id)
			);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function deleteTestsolve() {
		try {
			if (isAdmin) {
				await removeTestsolver(Number($page.params.id));
				toast.success("Successfully deleted testsolve!");
				window.location.href = "/admin/testsolves";
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function permissionCheck() {
		try {
			// check permission
			testsolve = await getOneTestsolve(Number($page.params.id));

			if (testsolve.length === 0) {
				throw new Error(
					"Testsolve with id " + $page.params.id + " doesn't exist!"
				);
			} else {
				testsolve = testsolve[0];
				if (
					(await getThisUserRole()) === 40 ||
					testsolve.solver_id === user.id
				) {
					disallowed = false;
				} else {
					// check if test coordinator
					const exists = await checkIfTestCoordinator(
						testsolve.test_id,
						user.id
					);
					if (exists) {
						disallowed = false;
					}
				}
			}

			console.log("testsolve", testsolve);

			if (disallowed) {
				loading = false;
			} else {
				await getAnswers();
				await getLocalFeedbackQuestions();
				await getFeedbackAnswers();
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getAnswers() {
		try {
			answers = await getProblemFeedback(Number($page.params.id));
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function submitTestsolve() {
		try {
			endTime = new Date();

			await updateTestsolve(Number($page.params.id), { feedback: "" });

			// delete old answers
			await deleteTestsolveAnswer(Number($page.params.id));
			await addProblemTestsolveAnswer(
				answers.map((ans) => ({
					solver_id: user.id,
					testsolve_id: $page.params.id,
					problem_id: ans.problem_id,
					answer: ans.answer,
					feedback: ans.feedback,
					correct: ans.correct,
				}))
			);

			loading = true;
			for (const ans of feedbackAnswers) {
				await updateTestsolveFeedbackAnswers(ans.id, {
					testsolve_id: $page.params.id,
					feedback_question: ans.feedback_question,
					answer: ans.answer,
				});
			}
			getAnswers();
			getFeedbackAnswers();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function loadIsAdmin() {
		try {
			const role = await getThisUserRole();
			if (role >= 40) {
				isAdmin = true;
			} else {
				isAdmin = false;
			}
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
			isAdmin = false;
		}
	}
</script>

{#if loading}
	<p>Loading...</p>
{:else if disallowed}
	<p>You are not a testsolver for this test!</p>
{:else}
	<br />
	{#if isAdmin}
		<Button action={deleteTestsolve} title="Delete Testsolve" />
	{/if}
	<br />

	<TestView
		testId={testsolve.test_id}
		bind:answers
		answerable
		reviewing
		on:submit={submitTestsolve}
		{feedbackAnswers}
		{feedbackQuestions}
	/>
	<Button action={submitTestsolve} title="Submit" />
	<br />
	<div class="timer">
		<p>Time taken: {formatTime(timeElapsed, { hideHours: true })}</p>
	</div>
{/if}

<style>
	.timer {
		position: absolute;
		right: 0;
		top: 0;
		margin: 10px;
		padding: 10px;
		background-color: var(--text-color-light);
		border: 1px solid black;
	}
</style>
