<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Loading from "$lib/components/Loading.svelte";
	import { TextInput } from "carbon-components-svelte";
	import { getFullProblems } from "$lib/getProblems";
	import toast from "svelte-french-toast";
	import { getAllRelevantTests } from "$lib/supabase/problems";
	import { handleError } from "$lib/handleError.ts";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let loadingProblems = true;
	let refreshingProblems = false;
	let testProblems = [];
	let allProblems = [];
	let userIsTestCoordinator = false;

	let testVersion = null;
	let testVersionWasChanged = false;

	async function getTest() {
		try {
			let { data: tests, error } = await supabase
				.from("tests")
				.select("*,test_coordinators(users(*)),tournaments(tournament_name)")
				.eq("id", testId)
				.limit(1)
				.single();
			if (error) throw error;
			test = tests;
			testVersion = test.test_version;

			testCoordinators = test.test_coordinators.map((x) => x.users);
			userIsTestCoordinator =
				!!testCoordinators.find((tc) => tc.id === supabase.auth.user().id) ||
				(await getThisUserRole()) >= 40;
			loading = false;
			getProblems();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getProblems() {
		try {
			let { data: problemList, error } = await supabase
				.from("test_problems")
				.select("*,full_problems(*)")
				.eq("test_id", testId)
				.order("problem_number");
			if (error) throw error;

			//console.log(problemList);
			// filter duplicates ?? idk why they appear
			problemList = problemList.filter(
				(x, i) => problemList[i - 1]?.relation_id !== x.relation_id
			);
			//console.log(problemList);
			testProblems = problemList.map((pb) => ({
				problem_number: pb.problem_number,
				relation_id: pb.relation_id,
				test_id: pb.test_id,
				...pb.full_problems,
			}));
			selectedTest = testProblems.map((pb) => pb.id);
			let allProblemList = await getFullProblems();
			// prevent problems from appearing twice
			allProblems = allProblemList.filter(
				(pb) => !testProblems.find((tpb) => tpb.id === pb.id)
			);
			//console.log(testProblems, allProblems);

			let relevantTests = await getAllRelevantTests();
			for (let i of testProblems) {
				let tmp_test_names = relevantTests[i.id].map((obj) => {
					return obj.test_name;
				});
				i.test_names = tmp_test_names.join(", ");
			}
			for (let i of allProblems) {
				if (relevantTests[i.id] !== undefined) {
					let tmp_test_names = relevantTests[i.id].map((obj) => {
						return obj.test_name;
					});
					i.test_names = tmp_test_names.join(", ");
				} else {
					i.test_names = "None";
				}
			}

			selectedAll = [];

			loadingProblems = false;
			refreshingProblems = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
		let selectedProblem = testProblems.find(
			(pb) => !selectedTest.includes(pb.id)
		);
		if (selectedProblem) removeProblemFromTest(selectedProblem);
	}

	async function addProblemToTest(problem) {
		try {
			selectedAll = [];
			refreshingProblems = true;
			let { error } = await supabase.rpc("add_test_problem", {
				p_problem_id: problem.id,
				p_test_id: testId,
			});
			if (error) throw error;
			refreshProblems();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function removeProblemFromTest(problem) {
		try {
			selectedAll = [];
			refreshingProblems = true;
			let { error } = await supabase.rpc("delete_test_problem", {
				p_problem_id: problem.id,
				cur_test_id: testId,
			});
			if (error) throw error;
			refreshProblems();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function refreshProblems() {
		await getProblems();
	}

	async function handleReorder(e) {
		try {
			refreshingProblems = true;
			let { id, to } = e.detail;
			let { error } = await supabase.rpc("reorder_test_problem", {
				p_problem_id: id,
				p_new_number: to,
				cur_test_id: testId,
			});
			if (error) throw error;
			refreshProblems();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	// manually reset the problem numbers to 1, 2, ...
	async function fixProblemOrder() {
		try {
			// confirm first
			let shouldReorder = confirm(
				"Are you sure you want to fix problem numbers? Only do this if they are broken."
			);
			if (!shouldReorder) return;

			loadingProblems = true;

			for (let i = 0; i < testProblems.length; i++) {
				const curProblem = testProblems[i];
				if (curProblem.problem_number !== i) {
					// needs reordering
					let { error } = await supabase
						.from("test_problems")
						.update({
							problem_id: curProblem.id,
							test_id: curProblem.test_id,
							problem_number: i,
						})
						.eq("relation_id", curProblem.relation_id);
					if (error) {
						throw error;
						refreshProblems();
						return;
					}
				}
			}

			loadingProblems = false;

			refreshProblems();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
			refreshProblems();
		}
	}

	function changeVersionInput() {
		testVersionWasChanged = true;
	}

	async function submitVersionChange() {
		try {
			testVersionWasChanged = false; // hide button to prevent multiple tries
			let { error } = await supabase
				.from("tests")
				.update({ test_version: testVersion })
				.eq("id", testId);
			if (error) throw error;
			else toast.success("Test version changed successfully.");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getTest();
</script>

{#if loading}
	<Loading />
{:else}
	<br />
	<h1>Test: {test.test_name}</h1>
	<p><strong>Tournament:</strong> {test.tournaments.tournament_name}</p>
	<p><strong>Description:</strong> {test.test_description}</p>
	<p>
		<strong>Coordinators:</strong>
		{testCoordinators.length === 0
			? "None"
			: testCoordinators.map((tc) => tc.full_name).join(", ")}
	</p>
	<br />
	<Button href={`/tests/${testId}`} title="Go back" /> <br /><br />
	<Button action={fixProblemOrder} title="Fix problem numbers" />
	<br /><br />
	{#if !userIsTestCoordinator}
		<p>You are not a coordinator so you cannot edit the problems!</p>
	{:else if loadingProblems}
		<p>Loading problems...</p>
	{:else}
		<!-- version number -->
		<div style="display: flex; justify-content: center;">
			<div>
				<TextInput
					labelText="Test Version"
					bind:value={testVersion}
					on:input={changeVersionInput}
				/>
				<div
					style="visibility: {testVersionWasChanged
						? 'visible'
						: 'hidden'}; padding-top: 5px;"
				>
					<Button action={submitVersionChange} title="Submit changes" />
				</div>
			</div>
		</div>
		<div class="flex-row">
			<div class="flex-col">
				<h3>All Problems</h3>
				<ProblemList
					problems={allProblems}
					condensed
					selectable
					showUnresolved={false}
					editable={false}
					bind:selectedItems={selectedAll}
					disableAll={refreshingProblems}
					showProblemTests
				/>
			</div>
			<div class="flex-col">
				<h3>Test Problems</h3>
				<ProblemList
					problems={testProblems}
					condensed
					selectable
					draggable
					showUnresolved={false}
					editable={false}
					pageEnabled={false}
					bind:selectedItems={selectedTest}
					disableAll={refreshingProblems}
					customHeaders={[
						{ key: "drag", value: "", sort: false },
						{ key: "problem_number", value: "#" },
					]}
					on:reorder={handleReorder}
					showProblemTests
				/>
			</div>
		</div>
	{/if}
{/if}

<style>
	.flex-row {
		display: grid;
		grid-template-columns: 50% 50%;
		width: 100%;
	}

	.flex-col {
		width: 100%;
		padding: 10px;
	}
</style>
