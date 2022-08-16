<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let loadingProblems = true;
	let refreshingProblems = false;
	let testProblems = [];
	let allProblems = [];
	let userIsTestCoordinator = false;

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select("*,test_coordinators(users(*))")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
		}
		test = tests;

		testCoordinators = test.test_coordinators.map((x) => x.users);
		userIsTestCoordinator = !!testCoordinators.find(
			(tc) => tc.id === supabase.auth.user().id
		);
		loading = false;
		getProblems();
	}

	async function getProblems() {
		let { data: problemList, error } = await supabase
			.from("test_problems")
			.select("*,full_problems(*)")
			.eq("test_id", testId)
			.order("problem_number");
		testProblems = problemList.map((pb) => ({
			problem_number: pb.problem_number,
			...pb.full_problems,
		}));
		selectedTest = testProblems.map((pb) => pb.id);

		let { data: allProblemList, error2 } = await supabase
			.from("unused_problems")
			.select("*");
		allProblems = allProblemList;
		selectedAll = [];

		loadingProblems = false;
		refreshingProblems = false;
	}

	let selectedAll = [];
	let selectedTest = []; // should store every id of test problems

	// watch for things getting selected
	$: if (selectedAll.length > 0) {
		let selectedProblem = allProblems.find((pb) => pb.id === selectedAll[0]);
		if (selectedProblem) addProblemToTest(selectedProblem);
		else {
			console.error(
				"Selected problem was null? ID:",
				selectedAll[0],
				"Problems:",
				allProblems
			);
		}
	}

	$: if (selectedTest.length < testProblems.length) {
		// be careful to remove from testProblems first to avoid circular calling
		let selectedProblem = testProblems.find(
			(pb) => !selectedTest.includes(pb.id)
		);
		if (selectedProblem) removeProblemFromTest(selectedProblem);
	}

	async function addProblemToTest(problem) {
		/*allProblems = allProblems.filter((pb) => pb.id !== problem.id);
		testProblems = [...testProblems, problem];
		selectedTest = [...selectedTest, problem.id];*/
		let { error } = await supabase.from("test_problems").insert({
			problem_id: problem.id,
			test_id: testId,
			// TODO: implement problem number
		});
		if (error) alert(error.message);
		refreshProblems();
	}

	async function removeProblemFromTest(problem) {
		/*testProblems = testProblems.filter((pb) => pb.id !== problem.id);
		allProblems = [...allProblems, problem];
		selectedTest = testProblems.map((pb) => pb.id);*/
		let { error } = await supabase
			.from("test_problems")
			.delete()
			.eq("problem_id", problem.id);
		if (error) alert(error.message);
		refreshProblems();
	}

	async function refreshProblems() {
		refreshingProblems = true;
		getProblems();
	}

	getTest();
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1>Test: {test.test_name}</h1>
	<p>Description: {test.test_description}</p>
	<p>
		Coordinators: {testCoordinators.length === 0
			? "None"
			: testCoordinators.map((tc) => tc.full_name).join(", ")}
	</p>
	<Button href={`/tests/${testId}`} title="Go back" />
	{#if !userIsTestCoordinator}
		<p>You are not a coordinator so you cannot edit the problems!</p>
	{:else if loadingProblems}
		<p>Loading problems...</p>
	{:else}
		<div class="flex-row">
			<div class="flex-col">
				<h3>All Problems</h3>
				<ProblemList
					problems={allProblems}
					condensed
					selectable
					editable={false}
					bind:selectedItems={selectedAll}
				/>
			</div>
			<div class="flex-col">
				<h3>Test Problems</h3>
				<ProblemList
					problems={testProblems}
					condensed
					selectable
					editable={false}
					bind:selectedItems={selectedTest}
				/>
			</div>
		</div>
	{/if}
{/if}

<style>
	.flex-row {
		display: flex;
	}

	.flex-col {
		flex: 50%;
	}
</style>
