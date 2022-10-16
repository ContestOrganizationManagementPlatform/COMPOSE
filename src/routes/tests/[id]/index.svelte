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

	function getTestLink() {
		let link =
			"https://latexonline.cc/compile?text=\\documentclass{article}\n\\usepackage[utf8]{inputenc}\\usepackage{amsmath, amsfonts, amssymb}\\title{" +
			test.test_name +
			"}\\author{" +
			test.tournaments.tournament_name +
			"}\\date{Mustang Math}\\begin{document}\\maketitle";
		for (const problem of problems) {
			link +=
				"\\section{Problem " +
				(problem.problem_number + 1) +
				"}" +
				problem.problem_latex +
				"";
		}
		return link + "\\end{document}";
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
		<Button href={`/tests/${testId}/testsolve`} title="Manage testsolves" />
		<br /><br />
	{/if}
	{#if loadingProblems}
		<p>Loading problems...</p>
	{:else}
		<div class="row" style="grid-template-columns: 70% 30%;">
			<div class="col" style="margin: auto;margin-bottom: 20px;padding: 10px;">
				<ProblemList
					{problems}
					customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
				/>
			</div>
			<div class="col" style="margin: auto;padding: 10px;">
				<a class="download" href={getTestLink()}
					><i class="fa fa-download" style="margin-right: 2px;" />Download Test
					PDF</a
				>
			</div>
		</div>
	{/if}
{/if}

<style>
	.download {
		text-decoration: none;
		color: black;
		border: 3px solid var(--green);
		padding: 10px;
	}
</style>
