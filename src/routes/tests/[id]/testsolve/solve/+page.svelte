<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";
	import { InlineNotification } from "carbon-components-svelte";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import { onDestroy } from "svelte";

	let errorTrue = false;
	let errorMessage = "";

	let loading = true;
	let disallowed = true;

	let answers = [];

	let startTime = null;
	let endTime = null;

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

		startTime = new Date();

		loading = false;
	}

	permissionCheck();

	async function submitTestsolve() {
		endTime = new Date();

		let { data, error } = await supabase.from("testsolves").insert([
			{
				test_id: $page.params.id,
				solver_id: supabase.auth.user().id,
				start_time: startTime.toISOString(),
				end_time: endTime.toISOString(),
			},
		]);

		if (error) {
			errorTrue = true;
			loading = false;
			errorMessage = error.message;
		} else {
			let testsolveId = data[0].id;

			let { data2, error2 } = await supabase.from("testsolve_answers").insert(
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
				loading = false;
				errorMessage = error.message;
			} else {
				window.location.href = "/testsolve/" + testsolveId;
			}
		}
	}

	let timeElapsed = 0; // in ms

	function updateTimer() {
		timeElapsed = new Date().getTime() - startTime.getTime();
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
		submittable
		on:submit={submitTestsolve}
	/>
	<div class="timer">
		<p>Time elapsed: {formatTime(timeElapsed, { hideHours: true })}</p>
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
