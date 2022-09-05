<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let problems = [];
	let problemCounts = [];
	let width = 0;
	let loaded = false;

	let errorTrue = false;
	let errorMessage = "";

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
		loaded = true;
	})();
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
