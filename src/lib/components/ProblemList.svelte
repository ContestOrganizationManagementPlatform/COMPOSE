<script>
	import {
		DataTable,
		DataTableSkeleton,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import { formatDate } from "$lib/formatDate.js";
	import Problem from "$lib/components/Problem.svelte";

	export let problems = [];
	export let condensed = false;
	export let selectable = false;
	export let selectedItems = [];
	export let nonselectableItems = [];
	export let editable = true;
	export let disableAll = false; // disables everything from being selectable
	export let customHeaders = [];

	let width = 0;
	let mobileFriendly = {
		Algebra: "Alg",
		Mixed: "Mx",
		"Number Theory": "NT",
		Combination: "Comb",
		Geometry: "Geo",
	};

	let headers = [
		{ key: "edit", value: "", width: "20px" },
		{ key: "front_id", value: "ID" },
		{ key: "full_name", value: "Author" },
		{ key: "topics_short", value: "Topics" },
		{ key: "sub_topics", value: width > 700 ? "SubTopic" : "SubTop" },
		{ key: "difficulty", value: width > 700 ? "Difficulty" : "Diff." },
		{ key: "created_at", value: width > 700 ? "Created on" : "Created" },
		{ key: "edited_at", value: width > 700 ? "Edited on" : "Edited" },
	];

	let headersCondensed = [
		{ key: "edit", value: "", width: "20px" },
		{ key: "front_id", value: "ID" },
		{ key: "full_name", value: "Author" },
		{ key: "topics_short", value: "Topics" },
		{ key: "sub_topics", value: width > 700 ? "SubTopic" : "SubTop" },
		{ key: "difficulty", value: width > 700 ? "Difficulty" : "Diff." },
	];

	let headerVersion = condensed ? headersCondensed : headers;

	let curHeaders = [
		...customHeaders,
		...(editable ? headerVersion : headerVersion.slice(1)),
	];
</script>

<svelte:window bind:outerWidth={width} />

<div class="flex">
	<DataTable
		size="short"
		expandable
		sortable
		{selectable}
		bind:selectedRowIds={selectedItems}
		nonSelectableRowIds={disableAll
			? problems.map((pb) => pb.id)
			: nonselectableItems}
		class="datatable"
		headers={curHeaders}
		rows={problems}
	>
		<Toolbar size="sm">
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows />
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === "edit"}
				<div class="pencil">
					<Link class="link" href={"/problems/" + row.id}
						><i class="ri-pencil-fill" /></Link
					>
				</div>
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
