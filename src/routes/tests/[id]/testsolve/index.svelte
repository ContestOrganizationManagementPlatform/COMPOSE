<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { getThisUserRole } from "$lib/getUserRole.js";
	import { Loading } from "carbon-components-svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let testSolvers = [];
	let loading = true;
	let userIsTestCoordinator = false;

	let errorTrue = false;
	let errorMessage = "";

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select(
				"*,test_coordinators(users(*)),tournaments(tournament_name),testsolvers(users(*))"
			)
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		test = tests;

		testCoordinators = test.test_coordinators.map((x) => x.users);
		testSolvers = test.testsolvers.map((x) => x.users);
		userIsTestCoordinator =
			!!testCoordinators.find((tc) => tc.id === supabase.auth.user().id) ||
			(await getThisUserRole()) >= 40;
		loading = false;
	}

	getTest();
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
	<Loading />
{:else if !userIsTestCoordinator}
	<p>You are not a test coordinator!</p>
{:else}
	<br />
	<h1>Test: {test.test_name}</h1>
	<p style="margin-bottom: 5px;">
		<strong>Solvers:</strong>
		{testSolvers.length === 0
			? "None"
			: testSolvers.map((ts) => ts.full_name).join(", ")}
	</p>
	<Button href={`/tests/${testId}`} title="Go back" />
	<br /> <br />
	<Button
		href={`/tests/${testId}/testsolve/manage`}
		title="Manage testsolvers"
	/>
{/if}
