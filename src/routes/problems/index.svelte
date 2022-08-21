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
<div style="margin-top: 10px;">
	<Button title="Create a new problem" href="/problems/new" />
</div>
<br />
<div class="flex">
	<div class="stats">
		<h4><u>Stats</u></h4>
		<p><strong>Number of Problems:</strong> backend</p>
		<p><strong>Algebra Problems:</strong> backend</p>
		<p><strong>Geometry Problems:</strong> backend</p>
		<p><strong>Number Theory Problems:</strong> backend</p>
		<p><strong>Combinatorics Problems:</strong> backend</p>
		<p><strong>Mixed Problems:</strong> backend</p>
	</div>
</div>
<div style="width:80%; margin: auto;margin-bottom: 20px;">
	<ProblemList {problems} />
</div>

<style>
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
