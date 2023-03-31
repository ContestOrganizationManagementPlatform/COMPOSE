<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";
	import {
		InlineNotification,
		TextArea,
		Form,
		TextInput,
	} from "carbon-components-svelte";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import { onDestroy } from "svelte";
	import Button from "$lib/components/Button.svelte";

	let errorTrue = false;
	let errorMessage = "";

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

	async function getFeedbackQuestions() {
		try {
			let { data: test_feedback_questions, error } = await supabase
				.from("test_feedback_questions")
				.select("*")
				.eq("test_id", $page.params.id);
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

	async function permissionCheck() {
		// check permission
		if ((await getThisUserRole()) >= 40) {
			disallowed = false;
		} else {
			let { data, error, count } = await supabase
				.from("testsolvers")
				.select("*", { count: "exact", head: true })
				.eq("test_id", $page.params.id)
				.eq("solver_id", supabase.auth.user().id);
			if (error) {
				errorTrue = true;
				loading = false;
				errorMessage = error.message;
			} else if (count > 0) {
				disallowed = false;
			}
		}

		await loadTestsolve();

		loading = false;
	}

	async function loadTestsolve() {
		await getFeedbackQuestions();

		// check if there is a prior testsolve

		let { data, error } = await supabase
			.from("testsolves")
			.select("*")
			.eq("test_id", $page.params.id)
			.eq("solver_id", supabase.auth.user().id)
			.eq("completed", false);

		if (error) alert(error.message);

		if (data.length > 0) {
			loadedTestsolve = data[0];

			//console.log(loadedTestsolve);

			// need to fetch all the previous answers
			let { data: data2, error: error2 } = await supabase
				.from("testsolve_answers")
				.select("*")
				.eq("testsolve_id", loadedTestsolve.id);

			if (error2) {
				errorTrue = true;
				errorMessage = error.message;
			} else {
				answers = data2;
			}

			// need to fetch all the previous feedback answers
			let { data: data3, error: error3 } = await supabase
				.from("testsolve_feedback_answers")
				.select("*")
				.eq("testsolve_id", loadedTestsolve.id);
			if (error3) {
				errorTrue = true;
				errorMessage = error.message;
			} else {
				feedbackAnswers = data3;
			}

			// load in start time
			timeOffset = loadedTestsolve.time_elapsed;
		}
		startTime = new Date();
	}

	permissionCheck();

	async function submitTestsolve(completedSolve) {
		console.log("hi");
		endTime = new Date();

		// time elapsed in seconds
		const timeElapsed = Math.floor((endTime - startTime) / 1000) + timeOffset;

		let data;

		// fetch the current test version
		let { data: testData, error: testError } = await supabase
			.from("tests")
			.select("*")
			.eq("id", $page.params.id)
			.limit(1)
			.single();
		console.log(testData);

		// check if this is a resubmission
		if (loadedTestsolve) {
			let { data: tsData, error } = await supabase
				.from("testsolves")
				.update({
					test_id: $page.params.id,
					solver_id: supabase.auth.user().id,
					start_time: startTime.toISOString(),
					end_time: endTime.toISOString(),
					time_elapsed: timeElapsed,
					completed: completedSolve,
					test_version: testData.test_version,
				})
				.eq("id", loadedTestsolve.id);

			if (error) {
				errorTrue = true;
				loading = false;
				errorMessage = error.message;
			}

			data = tsData;
		} else {
			let { data: tsData, error } = await supabase.from("testsolves").insert([
				{
					test_id: $page.params.id,
					solver_id: supabase.auth.user().id,
					start_time: startTime.toISOString(),
					end_time: endTime.toISOString(),
					time_elapsed: timeElapsed,
					completed: completedSolve,
					test_version: testData.test_version,
				},
			]);

			if (error) {
				errorTrue = true;
				loading = false;
				errorMessage = error.message;
			}

			data = tsData;
		}

		let testsolveId = data[0].id;

		// update all answers if previous testsolve, else insert
		if (loadedTestsolve) {
			for (const ans of answers) {
				let { error: error2 } = await supabase
					.from("testsolve_answers")
					.update({
						testsolve_id: testsolveId,
						problem_id: ans.problem_id,
						answer: ans.answer,
						feedback: ans.feedback,
						correct: ans.correct,
					})
					.eq("id", ans.id);

				if (error2) {
					errorTrue = true;
					errorMessage = error2.message;
				}
			}
		} else {
			let { error: error2 } = await supabase.from("testsolve_answers").insert(
				answers.map((ans) => ({
					testsolve_id: testsolveId,
					problem_id: ans.problem_id,
					answer: ans.answer,
					feedback: ans.feedback,
					correct: ans.correct,
				}))
			);

			if (error2) {
				errorTrue = true;
				errorMessage = error2.message;
			}
		}

		// update answer to feedback questions
		if (loadedTestsolve) {
			for (const ans of feedbackAnswers) {
				let { error: error2 } = await supabase
					.from("testsolve_feedback_answers")
					.update({
						testsolve_id: testsolveId,
						feedback_question: ans.feedback_question,
						answer: ans.answer,
					})
					.eq("id", ans.id);
				if (error2) {
					errorTrue = true;
					errorMessage = error2.message;
				}
			}
		} else {
			let { error: error2 } = await supabase
				.from("testsolve_feedback_answers")
				.insert(
					feedbackAnswers.map((ans) => ({
						testsolve_id: testsolveId,
						feedback_question: ans.feedback_question,
						answer: ans.answer,
					}))
				);

			if (error2) {
				errorTrue = true;
				errorMessage = error2.message;
			}
		}

		if (!errorTrue) {
			if (!completedSolve) {
				window.location.href = "/testsolve";
			} else {
				window.location.href = "/testsolve/" + testsolveId;
			}
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
		background-color: var(--white);
		border: 1px solid black;
	}
</style>
