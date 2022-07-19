<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { Button } from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";

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

<br />
{#if loaded}
	<h1>Problem {problem.id}</h1>
	<br />
	<Button
		kind="primary"
		class="button"
		size="small"
		type="submit"
		href="/problems"
		style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
	>
		<p
			style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
		>
			Back to Problems
		</p>
	</Button>
	<br /><br />
	{#if editing}
		<Button
			kind="primary"
			class="button"
			size="small"
			type="submit"
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
			on:click={() => {
				editing = false;
			}}
		>
			<p
				style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
			>
				Return
			</p>
		</Button>
		<ProblemEditor originalProblem={problem} onSubmit={submitProblem} />
	{:else}
		<Button
			kind="primary"
			class="button"
			size="small"
			type="submit"
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
			on:click={() => {
				editing = true;
			}}
		>
			<p
				style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
			>
				Edit Problem
			</p>
		</Button>
		<br />
		<br />
		<Modal
			runHeader="Delete Problem"
			onSubmit={() => {
				console.log("test");
			}}
		/>
		<br />
		<br />
		<Problem {problem} showMetadata={true} />
	{/if}
{:else}
	<p>Loading problem...</p>
{/if}
