<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { getThisUserRole } from "$lib/getUserRole.js";
	import { Loading, Checkbox } from "carbon-components-svelte";
	import { InlineNotification } from "carbon-components-svelte";
	import { displayLatex } from "$lib/latexStuff.js";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let loadingProblems = true;
	let problems = [];
	let userIsTestCoordinator = false;

	let feedback = [];

	let errorTrue = false;
	let errorMessage = "";

	let link = "";
	let openModal = false;
	let values = [
		"Problems",
		"Problem ID",
		"Answers",
		"Solutions",
		"Comments",
		"Feedback",
	];
	let group = values.slice(0, 1);

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select(
				"*,test_coordinators(users(*)),tournaments(tournament_name),testsolves(test_id,feedback,id)"
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

		let { data: feedbackList, error2 } = await supabase
			.from("testsolve_answers")
			.select("*")
			.order("problem_id");

		feedback = feedbackList;

		problems = problemList.map((pb) => ({
			problem_number: pb.problem_number,
			...pb.full_problems,
		}));
		getTestLink();
		loadingProblems = false;
	}

	function getProblemFeedback(id) {
		var returning = [];
		for (var prob of feedback) {
			if (prob.problem_id == id) {
				returning.push(prob);
			}
		}
		return returning;
	}

	function getTestLink() {
		let l =
			"https://latexonline.cc/compile?target=test.tex&text=\\documentclass{article}\n\\usepackage[utf8]{inputenc}\\usepackage{amsmath,amsfonts,amssymb}\\usepackage[margin=1in]{geometry}\\title{" +
			test.test_name +
			"}\\author{" +
			test.tournaments.tournament_name +
			"}\\date{Mustang Math}\\begin{document}\\maketitle";

		if (group.includes("Feedback")) {
			l += "\\section*{Test Feedback}";
			for (var feedback of test.testsolves) {
				if (feedback.feedback != null && feedback.feedback != "") {
					l +=
						"\\textbf{" + feedback.id + ":} " + feedback.feedback + "\\newline";
				}
			}
		}

		for (const problem of problems) {
			l += group.includes("Problem ID")
				? "\\section*{Problem " +
				  (problem.problem_number + 1) +
				  " (" +
				  problem.front_id +
				  ")}"
				: "\\section*{Problem " + (problem.problem_number + 1) + "}";
			if (group.includes("Problems")) {
				l +=
					"\\textbf{Problem:} " + problem.problem_latex + "\\newline\\newline";
			}

			if (group.includes("Answers") && problem.answer_latex != "") {
				l += "\\textbf{Answer:} " + problem.answer_latex + "\\newline\\newline";
			}

			if (group.includes("Solutions") && problem.solution_latex != "") {
				l +=
					"\\textbf{Solution:} " +
					problem.solution_latex.replace("\\ans{", "\\boxed{") +
					"\\newline\\newline";
			}

			if (group.includes("Comments") && problem.comment_latex != "") {
				l +=
					"\\textbf{Comment:} " +
					problem.comment_latex.replace("\\ans{", "\\boxed{") +
					"\\newline\\newline";
			}

			if (group.includes("Feedback")) {
				var feed = getProblemFeedback(problem.problem_number);

				if (feed.length > 0) {
					l += "\\textbf{Feedback:} ";

					for (var f of feed) {
						if (f.feedback != "") {
							l += "\\\\\\textbf{" + f.testsolve_id + ":} " + f.feedback;
						}
					}

					l += "\\newline\\newline";
				}
			}
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

<br />
{#if loading}
	<Loading />
{:else}
	<div>
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
			<Button
				action={() => {
					openModal = !openModal;
				}}
				title="Open Test"
			/>
			<br /><br />
		{/if}
		{#if loadingProblems}
			<p>Loading problems...</p>
		{:else}
			<div style="padding: 20px;">
				<ProblemList
					{problems}
					customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
				/>
			</div>
		{/if}
	</div>

	{#if openModal}
		<div
			class="flex"
			style="background-color: rgba(0,0,0,0.5); position: absolute; top: 0; bottom: 0;right:0;left: 0;z-index: 100;"
		>
			<div
				style="width: 300px; height: max-content; z-index: 101;background-color: white;padding: 10px;position: relative;"
			>
				<div style="position: absolute; top: 5px; right: 8px;">
					<button
						on:click={() => {
							openModal = !openModal;
						}}
						style="font-size: 12px;cursor:pointer;outline: none;border: none;background: none;"
						><i class="fa-solid fa-x" /></button
					>
				</div>

				<p><strong>PDF Options</strong></p>

				{#each values as value}
					<Checkbox
						bind:group
						on:click={() => {
							setTimeout(function () {
								getTestLink();
							}, 50);
						}}
						labelText={value}
						{value}
					/>
				{/each}

				<br />
				<a href={link} target="_blank"
					><i class="fa-solid fa-up-right-from-square" /> Open Test in New Page</a
				>
				<br /><br />
			</div>
		</div>
	{/if}
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

	:global(.bx--checkbox-label:focus) {
		outline: none !important;
		border: none !important;
	}
</style>
