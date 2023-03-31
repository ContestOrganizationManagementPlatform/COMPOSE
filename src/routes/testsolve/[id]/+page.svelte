<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";
	import { InlineNotification } from "carbon-components-svelte";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import Button from "$lib/components/Button.svelte";

	let errorTrue = false;
	let errorMessage = "";

	let loading = true;
	let disallowed = true;

	let answers = [];
	let feedbackQuestions = {};
	let feedbackAnswers = [];

	let startTime = null;
	let endTime = null;

	let testsolve = null;
	let timeElapsed;
	$: timeElapsed =
		testsolve?.time_elapsed * 1000 ??
		new Date(testsolve?.end_time).getTime() -
			new Date(testsolve?.start_time).getTime();

	async function getFeedbackQuestions() {
		try {
			let { data: test_feedback_questions, error } = await supabase
				.from("test_feedback_questions")
				.select("*")
				.eq("test_id", testsolve.test_id);
			for (const x of test_feedback_questions) {
				feedbackQuestions[x.id] = x;
				feedbackAnswers.push({
					feedback_question: x.id,
					answer: "",
				});
			}
		} catch (error) {
			if (error.code !== "PGRST116") {
				errorTrue = true;
				errorMessage = error;
			}
		}
	}

	async function getFeedbackAnswers() {
		let { data: data3, error: error3 } = await supabase
			.from("testsolve_feedback_answers")
			.select("*")
			.eq("testsolve_id", $page.params.id);
		if (error3) {
			errorTrue = true;
			errorMessage = error.message;
		} else {
			feedbackAnswers = data3;
		}
	}

	async function permissionCheck() {
		// check permission
		let { data, error } = await supabase
			.from("testsolves")
			.select("*")
			.eq("id", $page.params.id);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else if (data.length === 0) {
			errorTrue = true;
			errorMessage = "Testsolve with id " + $page.params.id + " doesn't exist!";
		} else {
			testsolve = data[0];
			if (
				(await getThisUserRole()) === 40 ||
				testsolve.solver_id === supabase.auth.user().id
			) {
				disallowed = false;
			} else {
				// check if test coordinator
				let { data2, error2, count } = await supabase
					.from("test_coordinators")
					.select("*", { count: "exact", head: true })
					.eq("coordinator_id", supabase.auth.user().id)
					.eq("test_id", testsolve.test_id);
				if (error2) {
					errorTrue = true;
					errorMessage = error2.message;
				} else if (count > 0) {
					disallowed = false;
				}
			}
		}

		if (disallowed) {
			loading = false;
		} else {
			getAnswers();
			getFeedbackQuestions();
			getFeedbackAnswers();
		}
	}

	async function getAnswers() {
		let { data, error } = await supabase
			.from("testsolve_answers")
			.select("*")
			.eq("testsolve_id", $page.params.id);

		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else {
			answers = data;

			loading = false;
		}
	}

	permissionCheck();

	async function submitTestsolve() {
		endTime = new Date();

		let { data, error } = await supabase
			.from("testsolves")
			.update({
				feedback: "", // TODO: allow feedback update
			})
			.eq("id", $page.params.id);

		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else {
			// delete old answers
			let { error3 } = await supabase
				.from("testsolve_answers")
				.delete()
				.eq("testsolve_id", $page.params.id);

			if (error3) {
				errorTrue = true;
				errorMessage = error.message;
			} else {
				let { data2, error2 } = await supabase.from("testsolve_answers").insert(
					answers.map((ans) => ({
						testsolve_id: $page.params.id,
						problem_id: ans.problem_id,
						answer: ans.answer,
						feedback: ans.feedback,
						correct: ans.correct,
					}))
				);

				if (error2) {
					errorTrue = true;
					errorMessage = error.message;
				} else {
					loading = true;
					for (const ans of feedbackAnswers) {
						let { error: error2 } = await supabase
							.from("testsolve_feedback_answers")
							.update({
								testsolve_id: $page.params.id,
								feedback_question: ans.feedback_question,
								answer: ans.answer,
							})
							.eq("id", ans.id);
						if (error2) {
							errorTrue = true;
							errorMessage = error2.message;
						}
					}
					getAnswers();
					getFeedbackAnswers();
				}
			}
		}
	}
</script>

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

{#if loading}
	<p>Loading...</p>
{:else if disallowed}
	<p>You are not a testsolver for this test!</p>
{:else}
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
		background-color: var(--white);
		border: 1px solid black;
	}
</style>
