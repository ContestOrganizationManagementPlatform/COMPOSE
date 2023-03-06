<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import { sortIDs } from "$lib/sortIDs";
	import Button from "$lib/components/Button.svelte";
	import { InlineNotification, Checkbox } from "carbon-components-svelte";

	let problems = [];
	let problemCounts = [];
	let width = 0;
	let loaded = false;
	const userId = supabase.auth.user().id;

	let errorTrue = false;
	let errorMessage = "";

	let link = "";
	let openModal = false;
	let values = ["Problems", "Answers", "Solutions"];
	let group = values.slice(0, 1);

	(async () => {
		let { data: newProblems, error } = await supabase
			.from("full_problems")
			.select("*")
			.order("front_id");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		problems = newProblems;
		problems.sort((a, b) => sortIDs(a.front_id, b.front_id));

		let { data: problemCountsData, error2 } = await supabase
			.from("problem_counts")
			.select("*");
		if (error2) {
			errorTrue = true;
			errorMessage = error2.message;
		}
		problemCounts = problemCountsData.sort(
			(a, b) => b.problem_count - a.problem_count
		);
		//getProblemLink();
		loaded = true;
	})();

	function getProblemLink() {
		const macros = {
			"\\ans": "\\boxed{#1}",
			"\\Abs": "\\left\\lVert #1 \\right\\rVert",
			"\\ang": "\\left \\langle #1 \\right \\rangle",
			"\\set": "\\left\\{#1\\right\\}",
			"\\paren": "\\left(#1\\right)",
			"\\floor": "\\left\\lfloor #1 \\right\\rfloor",
			"\\ceil": "\\left\\lceil #1 \\right\\rceil",
			"\\VEC": "\\overrightarrow{#1}",
			"\\Mod": "\\enspace(\\text{mod}\\ #1)",
		}; // unfortunately this only works for commands with exactly one parameter for now
		let preamble = "";
		const keys = Object.keys(macros);
		for (var key of keys) {
            preamble += "\\newcommand{" + key + "}[1]{" + macros[key] + "}"
		}
		
		let l = import.meta.env.VITE_PDF_GENERATOR_LINK + "\\documentclass{article}\n\\usepackage[utf8]{inputenc}\\usepackage{amsmath,amsfonts,amssymb}\\usepackage[margin=1in]{geometry}" + preamble + "\\title{All Problems}\\date{Mustang Math}\\begin{document}\\maketitle";

		for (const problem of problems) {
			l += "\\section*{Problem " + problem.front_id + "}";
			if (group.includes("Problems")) {
				l += "\\textbf{" + problem.problem_latex + "}\\newline\\newline";
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
		}
		link = l + "\\end{document}";
	}
</script>

<svelte:window bind:outerWidth={width} />

<br />
<h1>Problem Inventory</h1>
{#if !loaded}
	<p>Loading problems...</p>
{/if}

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

<div style="margin-top: 10px;">
	<Button title="Create a new problem" href="/problems/new" />
</div>
<br />
<div class="flex">
	<div class="stats">
		<h4><u>Stats</u></h4>
		{#each problemCounts as cat}
			<p>
				<!-- prettier-ignore -->
				<strong>{cat.category === "*" ? "Number of" : cat.category} Problems:</strong>
				{cat.problem_count}
			</p>
		{/each}
	</div>
</div>

<Button
	action={() => {
		openModal = !openModal;
	}}
	title="Download All Problems"
/>
<br /><br />
<Button
	action={() => {
		problems = problems.filter((problem) => {
			return problem.author_id == userId;
		});
	}}
	title="My Problems"
/>
<br /><br />

<div style="width:80%; margin: auto;margin-bottom: 20px;">
	<ProblemList {problems} />
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
							getProblemLink();
						}, 50);
					}}
					labelText={value}
					{value}
				/>
			{/each}

			<br />
			<a href={link} download="test.pdf">Download Problems</a>
			<br /><br />
		</div>
	</div>
{/if}

<style>
	a {
		margin-bottom: 10px;
		border: 2px solid var(--green);
		padding: 5px 10px;
		font-weight: 600;
		text-decoration: none;
		color: black;
	}

	.stats {
		background-color: white;
		border: 1px solid var(--green);
		width: 80%;
		margin: 10px;
		text-align: left;
		padding: 10px;
	}

	:global(.bx--toolbar-content .bx--search .bx--search-input:focus) {
		outline-color: var(--green);
	}

	:global(.pencil .link) {
		border: none;
		outline: none;
	}
</style>
