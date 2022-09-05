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
	let loading = true;
	let loadingProblems = true;
	let problems = [];
	let userIsTestCoordinator = false;

	let errorTrue = false;
	let errorMessage = "";

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select("*,test_coordinators(users(*)),tournaments(tournament_name)")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		test = tests;

		testCoordinators = test.test_coordinators.map((x) => x.users);
		userIsTestCoordinator =
			!!testCoordinators.find((tc) => tc.id === supabase.auth.user().id) ||
			(await getThisUserRole()) >= 40;
		loading = false;
		getProblems();
	}

	async function getProblems() {
		let { data: problemList, error } = await supabase
			.from("test_problems")
			.select("*,full_problems(*)")
			.eq("test_id", testId)
			.order("problem_number");
		problems = problemList.map((pb) => ({
			problem_number: pb.problem_number,
			...pb.full_problems,
		}));
		loadingProblems = false;
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
{:else}
	<br />
	<h1>Test: {test.test_name}</h1>
	<p><strong>Tournament:</strong> {test.tournaments.tournament_name}</p>
	<p><strong>Description:</strong> {test.test_description}</p>
	<p style="margin-bottom: 5px;">
		<strong>Coordinators:</strong>
		{testCoordinators.length === 0
			? "None"
			: testCoordinators.map((tc) => tc.full_name).join(", ")}
	</p>
	{#if userIsTestCoordinator}
		<Button href={`/tests/${testId}/edit`} title="Edit problems" />
		<br /><br />
	{/if}
	{#if loadingProblems}
		<p>Loading problems...</p>
	{:else}
		<div style="width:80%; margin: auto;margin-bottom: 20px;">
			<ProblemList
				{problems}
				customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
			/>
		</div>
	{/if}
{/if}
