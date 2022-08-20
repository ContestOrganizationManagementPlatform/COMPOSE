<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { getThisUserRole } from "$lib/getUserRole.js";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let loadingProblems = true;
	let problems = [];
	let userIsTestCoordinator = false;

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select("*,test_coordinators(users(*)),tournaments(tournament_name)")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
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

{#if loading}
	<p>Loading...</p>
{:else}
	<h1>Test: {test.test_name}</h1>
	<p>Tournament: {test.tournaments.tournament_name}</p>
	<p>Description: {test.test_description}</p>
	<p>
		Coordinators: {testCoordinators.length === 0
			? "None"
			: testCoordinators.map((tc) => tc.full_name).join(", ")}
	</p>
	{#if userIsTestCoordinator}
		<Button href={`/tests/${testId}/edit`} title="Edit problems" />
	{/if}
	{#if loadingProblems}
		<p>Loading problems...</p>
	{:else}
		<ProblemList
			{problems}
			customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
		/>
	{/if}
{/if}
