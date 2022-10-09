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

	let testsolve = null;

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
					getAnswers();
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
		submittable
		on:submit={submitTestsolve}
	/>
	<!-- TODO: show test -->
{/if}
