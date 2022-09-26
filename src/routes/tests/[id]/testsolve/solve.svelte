<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";
	import { InlineNotification } from "carbon-components-svelte";
	import TestView from "$lib/components/TestView.svelte";

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
				errorMessage = error.message;
			} else {
				window.location.href = "/testsolve/" + testsolveId;
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
		testId={$page.params.id}
		bind:answers
		answerable
		submittable
		on:submit={submitTestsolve}
	/>
	<!-- TODO: show test -->
{/if}
