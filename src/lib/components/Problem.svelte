<script>
	import { supabase } from "$lib/supabaseClient";
	export let problem; // whole object from database
	export let showMetadata = true;
	export let showLatexErrors = false;
	export let failed = false; // if this problem failed to render (use as bind)
	let author = "";

	(async () => {
		let { data: users, error } = await supabase
			.from("users")
			.select("full_name")
			.eq("id", problem.author_id);
		author = users[0].full_name;
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
		console.log(latexes);
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

<h2>Problem</h2>
<p id="problem-render">{@html latexes.problem}</p>
<h2>Comment</h2>
<p id="comment-render">{@html latexes.comment}</p>
<h2>Answer</h2>
<p id="answer-render">{@html latexes.answer}</p>
<h2>Solution</h2>
<p id="solution-render">{@html latexes.solution}</p>
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
