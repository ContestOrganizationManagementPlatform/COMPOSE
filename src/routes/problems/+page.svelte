<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import { sortIDs } from "$lib/sortIDs";
	import Button from "$lib/components/Button.svelte";
	import { Checkbox } from "carbon-components-svelte";
	import toast from "svelte-french-toast";
	import { getFullProblems } from "$lib/getProblems";

	let problems = [];
	let problemCounts = [];
	let width = 0;
	let loaded = false;
	const userId = supabase.auth.user().id;

	let openModal = false;
	let values = ["Problems", "Answers", "Solutions", "Comments"];
	let group = values.slice(0, 1);

	(async () => {
		problems = await getFullProblems();

		let { data: problemCountsData, error2 } = await supabase
			.from("problem_counts")
			.select("*");
		if (error2) {
			toast.error(error2.message);
		}
		problemCounts = problemCountsData.sort(
			(a, b) => b.problem_count - a.problem_count
		);
		//getProblemLink();
		loaded = true;
	})();

	async function getBucketPaths(path) {
		const { data, error } = await supabase.storage
			.from("problem-images")
			.list(path);
		if (error) throw error;
		else {
			let ans = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].id != null) {
					if (path === "") {
						ans.push(data[i].name);
					} else {
						ans.push(path + "/" + data[i].name);
					}
				} else {
					let x;
					if (path === "") {
						x = await getBucketPaths(data[i].name);
					} else {
						x = await getBucketPaths(path + "/" + data[i].name);
					}
					for (let j = 0; j < x.length; j++) {
						ans.push(x[j]);
					}
				}
			}
			return ans;
		}
	}

	async function openProblemsPDF() {
		let l =
			"\\title{All Problems}\\date{Mustang Math}\\begin{document}\\maketitle";

		for (const problem of problems) {
			l += "\\section*{Problem " + problem.front_id + "}";
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
		}
		l += "\\end{document}";

		let images = await getBucketPaths("");

		const resp = await fetch(
			// make env variable before pushing
			import.meta.env.VITE_PDF_GENERATOR_URL,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					mode: "no-cors",
				},
				body: JSON.stringify({
					latex: l,
					images,
				}),
			}
		);
		const blob = await resp.blob();
		const newBlob = new Blob([blob]);
		const blobUrl = window.URL.createObjectURL(newBlob);
		const link = document.createElement("a");
		link.href = blobUrl;
		link.setAttribute("download", "problems.pdf");
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);

		// clean up Url
		window.URL.revokeObjectURL(blobUrl);
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
				<Checkbox bind:group labelText={value} {value} />
			{/each}

			<br />
			<button on:click={openProblemsPDF}>Download Problems</button>
			<br /><br />
		</div>
	</div>
{/if}

<style>
	.stats {
		background-color: white;
		border: 1px solid var(--primary);
		width: 80%;
		margin: 10px;
		text-align: left;
		padding: 10px;
	}
</style>
