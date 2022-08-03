<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		DataTable,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import Problem from "$lib/components/Problem.svelte";
	import { formatDate } from "$lib/formatDate.js";
	import Button from "$lib/components/Button.svelte";

	let problems = [];
	let width = 0;
	let mobileFriendly = {
		Algebra: "Alg",
		Mixed: "Mx",
		"Number Theory": "NT",
		Combination: "Comb",
		Geometry: "Geo",
	};
	let loaded = false;
	(async () => {
		let { data: newProblems, error } = await supabase
			.from("problems")
			.select("*,users(full_name),problem_topics(global_topics(topic_short))")
			.order("edited_at");
		newProblems.forEach((p) => {
			p.author = p.users?.full_name ?? "Unnamed User";
			console.log(p.problem_topics);
			p.topic =
				p.problem_topics?.map((x) => x.global_topics.topic_short).join(", ") ??
				"None";
		});

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
<div class="flex">
	<DataTable
		size="short"
		expandable
		sortable
		class="datatable"
		headers={[
			{ key: "edit", value: "", width: "20px" },
			{ key: "front_id", value: "ID" },
			{ key: "author", value: "Author" },
			{ key: "topic", value: "Topics" },
			{ key: "sub_topics", value: width > 700 ? "SubTopic" : "SubTop" },
			{ key: "difficulty", value: width > 700 ? "Difficulty" : "Diff." },
			{ key: "created_at", value: width > 700 ? "Created on" : "Created" },
			{ key: "edited_at", value: width > 700 ? "Edited on" : "Edited" },
		]}
		rows={problems}
	>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows />
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === "edit"}
				<Link class="link" href={"/problems/" + row.id}
					><i class="ri-pencil-fill" /></Link
				>
			{:else if cell.key === "topic"}
				<div style="overflow: hidden;">
					{cell.value == null || cell.value == ""
						? "None"
						: width > 700
						? cell.value
						: mobileFriendly[cell.value]}
				</div>
			{:else if cell.key === "author"}
				<div style="overflow: hidden;">
					{cell.value == null || cell.value == ""
						? "None"
						: width > 700
						? cell.value
						: cell.value.split(" ")[0].charAt(0) +
						  cell.value.split(" ")[1].charAt(0)}
				</div>
			{:else if cell.key === "created_at"}
				<div style="overflow: hidden;">
					{cell.value ? formatDate(new Date(cell.value)) : "N/A"}
				</div>
			{:else if cell.key === "edited_at"}
				<div style="overflow: hidden;">
					{cell.value ? formatDate(new Date(cell.value)) : "N/A"}
				</div>
			{:else}
				<div style="overflow: hidden;">
					{cell.value == null || cell.value == "" ? "None" : cell.value}
				</div>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="expanded-row" let:row>
			<Problem problem={row} />
		</svelte:fragment>
	</DataTable>
</div>
<br />
