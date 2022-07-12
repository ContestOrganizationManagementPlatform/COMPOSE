<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { Button } from "carbon-components-svelte";

	let problem;
	let loaded = false;
	let editing = false;

	async function fetchProblem() {
		let { data: problems, error } = await supabase
			.from("problems")
			.select("*")
			.eq("id", $page.params.id)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
		} else {
			problem = problems;
			loaded = true;
		}
	}
	fetchProblem();

	async function submitProblem(payload) {
		let { error } = await supabase
			.from("problems")
			.update(payload, { returning: "minimal" })
			.eq("id", $page.params.id);
		if (error) alert(error);
		fetchProblem();
	}
</script>

{#if loaded}
	{#if editing}
		<ProblemEditor originalProblem={problem} onSubmit={submitProblem} />
		<Button
			on:click={() => {
				editing = false;
			}}>Return</Button
		>
	{:else}
		<Problem {problem} showMetadata={true} />
		<Button
			on:click={() => {
				editing = true;
			}}>Edit Problem</Button
		>
	{/if}
{:else}
	<p>Loading problem...</p>
{/if}

<Button href="/problems">Back to problems</Button>
