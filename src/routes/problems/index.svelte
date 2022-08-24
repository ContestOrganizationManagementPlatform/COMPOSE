<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";

	let problems = [];
	let problemCounts = [];
	let width = 0;
	let loaded = false;
	(async () => {
		let { data: newProblems, error } = await supabase
			.from("full_problems")
			.select("*")
			.order("front_id");
		if (error) alert(error.message);
		problems = newProblems;

		let { data: problemCountsData, error2 } = await supabase
			.from("problem_counts")
			.select("*");
		if (error2) alert(error2.message);
		problemCounts = problemCountsData.sort(
			(a, b) => b.problem_count - a.problem_count
		);
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
		{#each problemCounts as cat}
			<p>
				<!-- prettier-ignore -->
				<strong>{cat.category === "*" ? "Number of" : cat.category} Problems:</strong>
				{cat.problem_count}
			</p>
		{/each}
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
