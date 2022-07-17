<script>
	import { supabase } from "$lib/supabaseClient";
	export let problem; // whole object from database
	export let showMetadata = false;
	export let showLatexErrors = false;
	export let failed = false; // if this problem failed to render (use as bind)
	let author = "";

	(async () => {
		if ("author_id" in problem) {
			let { data: users, error } = await supabase
				.from("users")
				.select("full_name")
				.eq("id", problem.author_id);
			author = users[0].full_name;
		}
	})();

	import { displayLatex } from "$lib/latexStuff.js";

	let latexes = {
		problem: "",
		comment: "",
		answer: "",
		solution: "",
	};
	let fieldList = ["problem", "comment", "answer", "solution"];
	let errorList = [];

	$: {
		failed = false;
		for (const field of fieldList) {
			const displayed = displayLatex(problem[field + "_latex"]);
			displayed.errorList.forEach((x) => (x.field = field)); // add context to errors
			errorList.push(...displayed.errorList);
			latexes[field] = displayed.out;
			for (const err of displayed.errorList) {
				if (err.sev === "err") failed = true;
			}
		}
	}
</script>

{#if showLatexErrors}
	{#each errorList as err}
		<div style="border: 1px solid black;">
			<p>Error (in {err.field}): {err.error}</p>
			<p>Severity: {err.sev}</p>
		</div>
	{/each}
{/if}

{#if showMetadata}
	<h2>About</h2>
	<div class="flex">
		<div style="border: 2px solid black;width: 70%;margin: 10px;padding: 10px;">
			<p><span class="header">Author: </span>{author}</p>
			{#if "front_id" in problem}
				<p><span class="header">ID: </span>{problem.front_id}</p>
			{/if}
			{#if "nickname" in problem}
				<p><span class="header">Nickname: </span>{problem.nickname}</p>
			{/if}
			{#if "topic" in problem}
				<p><span class="header">Topic: </span>{problem.topic}</p>
			{/if}
			{#if "sub_topics" in problem}
				<p><span class="header">Sub-Topic: </span>{problem.sub_topics}</p>
			{/if}
			{#if "difficulty" in problem}
				<p><span class="header">Difficulty: </span>{problem.difficulty}</p>
			{/if}
		</div>
	</div>
{/if}

{#if showMetadata}
	<h2>Information</h2>
{/if}
<div class="flex">
	<div style="border: 2px solid black;width: 70%;margin: 10px;padding: 10px;">
		<p class="header">Problem</p>
		<p id="problem-render">{@html latexes.problem}</p>
		<p class="header">Answer</p>
		<p id="answer-render">{@html latexes.answer}</p>
		<p class="header">Solution</p>
		<p id="solution-render">{@html latexes.solution}</p>
		<br />
		<p>
			<span class="header">Comments:</span>
			<span id="comment-render">{@html latexes.comment}</span>
		</p>
	</div>
</div>

<style>
	.header {
		font-weight: 700;
	}

	#comment-render {
		font-style: italic;
	}
</style>
