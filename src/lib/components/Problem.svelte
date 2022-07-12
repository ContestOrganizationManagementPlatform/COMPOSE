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
{#if showMetadata}
	<h2>Metadata</h2>
	Author: {author} <br />
	{#if "front_id" in problem}
		ID: {problem.front_id} <br />
	{/if}
	{#if "nickname" in problem}
		Nickname: {problem.nickname} <br />
	{/if}
	{#if "topic" in problem}
		Topic: {problem.topic} <br />
	{/if}
	{#if "sub_topics" in problem}
		Sub-Topic: {problem.sub_topics} <br />
	{/if}
	{#if "difficulty" in problem}
		Difficulty: {problem.difficulty} <br />
	{/if}
{/if}

<style>
	.header {
		font-weight: 700;
	}

	#comment-render {
		font-style: italic;
	}
</style>
