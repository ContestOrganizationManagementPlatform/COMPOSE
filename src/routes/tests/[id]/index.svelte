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

	let link = "";

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
		getProblems();
		loading = false;
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
		getTestLink();
		loadingProblems = false;
	}

	function getTestLink() {
		let l =
			"https://latexonline.cc/compile?text=\\documentclass{article}\n\\usepackage[utf8]{inputenc}\\usepackage{amsmath, amsfonts, amssymb}\\title{" +
			test.test_name +
			"}\\author{" +
			test.tournaments.tournament_name +
			"}\\date{Mustang Math}\\begin{document}\\maketitle";
		for (const problem of problems) {
			l +=
				"\\section{Problem " +
				(problem.problem_number + 1) +
				"}\\textbf{Problem:} " +
				problem.problem_latex +
				"\\\\\\textbf{Answer:} " +
				problem.answer_latex; // +
			//"\\\\\\textbf{Solution:} " +
			//problem.solution_latex;
		}
		link = l + "\\end{document}";
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
	<div class="row" style="grid-template-columns: 70% 30%;">
		<div class="col" style="margin: auto;margin-bottom: 20px;padding: 10px;">
			<h1>Test: {test.test_name}</h1>
			<p><strong>Tournament:</strong> {test.tournaments.tournament_name}</p>
			<p><strong>Description:</strong> {test.test_description}</p>
			<p style="margin-bottom: 5px;">
				<strong>Coordinators:</strong>
			</p>
			<div class="flex">
				<ul style="text-align: left;">
					{#each testCoordinators as coordinator}
						<li>- {coordinator.full_name}</li>
					{/each}
				</ul>
			</div>
			<br />
			{#if userIsTestCoordinator}
				<Button href={`/tests/${testId}/edit`} title="Edit problems" />
				<br /><br />
				<Button href={`/tests/${testId}/testsolve`} title="Manage testsolves" />
				<br /><br />
			{/if}
			{#if loadingProblems}
				<p>Loading problems...</p>
			{:else}
				<ProblemList
					{problems}
					customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
				/>
			{/if}
		</div>
		<div class="col" style="margin: auto;padding: 10px;">
			<a href={link} target="_blank"
				><i class="fa-solid fa-up-right-from-square" /> Open in New Page</a
			>
			<br /><br />
			<div class="wrap">
				<iframe
					scrolling="yes"
					width="100%"
					allowfullscreen={true}
					allow={true}
					height="100%"
					src={link}
					title="Test Preview"
				/>
			</div>
		</div>
	</div>
{/if}
<br />

<style>
	a {
		margin-bottom: 10px;
		border: 2px solid var(--green);
		padding: 5px 10px;
		font-weight: 600;
		text-decoration: none;
		color: black;
	}

	a:hover {
		cursor: pointer;
	}

	.wrap {
		width: 100%;
		height: 500px;
		padding: 0;
		overflow: hidden;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 0px;
	}
</style>
