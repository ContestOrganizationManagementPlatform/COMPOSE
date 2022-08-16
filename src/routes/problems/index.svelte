<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";

	let problems = [];
	let width = 0;
	let loaded = false;
	(async () => {
		let { data: newProblems, error } = await supabase
			.from("full_problems")
			.select("*")
			.order("front_id");

		problems = newProblems;
		loaded = true;
	})();
</script>

<svelte:window bind:outerWidth={width} />

<br />
<h1>Problem Inventory</h1>
{#if !loaded}
	<p>Loading problems...</p>
{/if}
<div style="margin-top: 10px; margin-bottom: 10px">
	<Button title="Create a new problem" href="/problems/new" />
</div>
<br />
<ProblemList {problems} />
<br />

<style>
	:global(.bx--toolbar-content .bx--search .bx--search-input:focus) {
		outline-color: var(--green);
	}

	:global(.pencil .link) {
		border: none;
		outline: none;
	}
</style>
