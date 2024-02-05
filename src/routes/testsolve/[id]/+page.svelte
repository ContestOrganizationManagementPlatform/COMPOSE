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
		getTest,
	} from "$lib/supabase";

	let loading = true;
	let disallowed = true;

	let answers = [];
	let feedbackQuestions = {};
	let feedbackAnswers = [];

	let startTime = new Date().getTime();
	let endTime = null;
	let isAdmin: boolean;

	let testsolve = null;
	let timeElapsed: number;

	timeElapsed = 0; // in ms

	$: timeElapsed =
		testsolve?.time_elapsed * 1000 ??
		new Date(testsolve?.end_time).getTime() -
			new Date(testsolve?.start_time).getTime();

	let user;
	(async () => {
		user = await getThisUser();
		await getTestsolve();
		await permissionCheck();
		console.log("Loaded isAdmin", isAdmin);
		console.log("Completed Perms Check 2");
		//await getLocalFeedbackQuestions();
		console.log(feedbackQuestions, feedbackAnswers);
		console.log(isAdmin, testsolve.completed);
	})();

	async function setFeedbackQuestions() {
		const test_feedback_questions = await getFeedbackQuestions(
			testsolve.test_id
		);
		for (const x of test_feedback_questions) {
			console.log("hello");
			console.log(x);
			feedbackQuestions[x.id] = x;
		}
	}

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
			for (const question of Object.values(feedbackQuestions)) {
				console.log("QUES", question);
				if (!(question.id in feedbackAnswers)) {
					feedbackAnswers.push({
						testsolve_id: testsolve.id,
						feedback_question: question.id,
						answer: "",
					});
				}
			}
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

	async function getTestsolve() {
		testsolve = await getOneTestsolve(Number($page.params.id));

		if (testsolve.length === 0) {
			throw new Error(
				"Testsolve with id " + $page.params.id + " doesn't exist!"
			);
		} else {
			testsolve = testsolve[0];
		}
	}

	async function permissionCheck() {
		try {
			if ((await getThisUserRole()) === 40) {
				disallowed = false;
				isAdmin = true;
			}
			if (await checkIfTestCoordinator(testsolve.test_id, user.id)) {
				disallowed = false;
				isAdmin = true;
			}
			if (testsolve.solver_id === user.id) {
				disallowed = false;
				isAdmin = false;
			}

			console.log("testsolve", testsolve);

			if (disallowed) {
				loading = false;
			} else {
				//await getLocalFeedbackQuestions();
				await setFeedbackQuestions();
				await getFeedbackAnswers();
				loading = false;
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function completeTestsolve() {
		console.log("DISPATCH 2");
		await updateTestsolve(testsolve.id, { completed: true });
		await getTestsolve();
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
			await getFeedbackAnswers();
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
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
	{#if !testsolve.completed && !isAdmin}
		<TestView
			{testsolve}
			answerable
			on:complete={completeTestsolve}
			{feedbackAnswers}
			{feedbackQuestions}
		/>
	{:else}
		<TestView
			{testsolve}
			answerable
			reviewing
			on:submit={submitTestsolve}
			{feedbackAnswers}
			{feedbackQuestions}
		/>
		<br />
		<Button action={submitTestsolve} title="Submit" />
	{/if}
{/if}

<style>
</style>
