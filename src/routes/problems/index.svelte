<script>
	import { supabase } from "$lib/supabaseClient";
	import Menu from "$lib/components/Menu.svelte";
	import { DataTable, Link, Button } from "carbon-components-svelte";
	import Problem from "$lib/components/Problem.svelte";

	let problems = [];
	let loaded = false;
	(async () => {
		let { data: newProblems, error } = await supabase
			.from("problems")
			.select("*");

		for (let problem of newProblems) {
			let { data: users, error } = await supabase
				.from("users")
				.select("full_name")
				.eq("id", problem.author_id);
			problem["author"] = users[0].full_name;
		}

		problems = newProblems;
		loaded = true;
	})();
</script>

<Menu path="problems" />
<br />
<h1>Problem Inventory</h1>
<br />
{#if !loaded}
	<p>Loading problems...</p>
{/if}
<div class="flex">
	<DataTable
		size="short"
		expandable
		class="datatable"
		headers={[
			{ key: "edit", value: "", width: "20px" },
			{ key: "front_id", value: "ID" },
			{ key: "author", value: "Author" },
			{ key: "topic", value: "Topic" },
			{ key: "sub_topics", value: "SubTopic" },
			{ key: "difficulty", value: "Difficulty" },
		]}
		rows={problems}
	>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === "edit"}
				<Link class="link" href={"/problems/" + row.id}
					><i class="ri-pencil-fill" /></Link
				>
			{:else}
				{cell.value == null || cell.value == "" ? "None" : cell.value}
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="expanded-row" let:row>
			<Problem problem={row} />
		</svelte:fragment>
	</DataTable>
</div>

<style>
	:global(.datatable) {
		width: 80%;
	}

	:global(.link),
	:global(.bx--data-table tr:hover .bx--link) {
		color: var(--black);
	}

	:global(.bx--link:hover) {
		color: var(--green) !important;
		cursor: pointer;
	}

	:global(.bx--table-expand__button:focus) {
		box-shadow: none;
	}
</style>
