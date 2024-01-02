<script>
	import {
		DataTable,
		DataTableSkeleton,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination,
		MultiSelect,
	} from "carbon-components-svelte";
	import Rating from "$lib/components/Rating.svelte";
	import { formatDate } from "$lib/formatDate.js";
	import Problem from "$lib/components/Problem.svelte";
	import { sortIDs } from "$lib/sortIDs";
	import Switcher from "carbon-icons-svelte/lib/Switcher.svelte";
	import { createEventDispatcher } from "svelte";
	import { Filter } from "carbon-icons-svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";

	export let problems = [];
	export let condensed = false;
	export let selectable = false;
	export let selectedItems = [];
	export let nonselectableItems = [];
	export let editable = true;
	export let disableAll = false; // disables everything from being selectable
	export let customHeaders = [];
	export let draggable = false;
	export let pageEnabled = true;
	export let showDifficulty = false;
	export let showUnresolved = true;
	export let showSubtopic = true;

	let showList = [
		"front_id",
		"full_name",
		"topics_short",
		"problem_tests",
		"average_difficulty",
		"average_quality",
		"created_at",
		"edited_at",
	];
	$: if (showUnresolved) {
		showList.push("unresolved_count");
	}
	$: if (showSubtopic) {
		showList.push("sub_topics");
	}
	$: if (showDifficulty) {
		showList.push("difficulty");
	}

	const dispatch = createEventDispatcher();

	let width = 0;
	let mobileFriendly = {
		Algebra: "Alg",
		Mixed: "Mx",
		"Number Theory": "NT",
		Combination: "Comb",
		Geometry: "Geo",
	};

	let pageSize = 25;
	let page = 1;

	let editHeader = { key: "edit", value: "", width: "30px" };

	let headers = [
		{
			key: "front_id",
			value: "ID",
			width: "100px",
			sort: sortIDs,
		},
		{
			key: "full_name",
			value: "Author",
		},
		{
			key: "topics_short",
			value: "Topics",
		},
		{
			key: "difficulty",
			value: "Difficulty",
		},
		{
			key: "problem_tests",
			value: "Test(s)",
		},
		{
			key: "sub_topics",
			value: "Subtopics",
		},
		{
			key: "average_difficulty",
			value: "Avg. Difficulty",
		},
		{
			key: "average_quality",
			value: "Avg. Quality",
		},
		{
			key: "unresolved_count",
			value: "Unresolved Feedback",
		},
		{
			key: "created_at",
			value: width > 700 ? "Created on" : "Created",
		},
		{
			key: "edited_at",
			value: width > 700 ? "Edited on" : "Edited",
		},
	];

	let headersCondensed = [
		{ key: "front_id", value: "ID", sort: sortIDs },
		{ key: "full_name", value: "Author" },
		{ key: "unresolved_count", value: "Unresolved" },
		{ key: "topics_short", value: "Topics" },
		{ key: "sub_topics", value: "SubTop" },
		{ key: "difficulty", value: width > 700 ? "Difficulty" : "Diff." },
		{ key: "problem_tests", value: "Test(s)" },
	];

	$: headersF = headers.filter((row) => showList.includes(row.key));
	$: headersCondensedF = headersCondensed.filter((row) =>
		showList.includes(row.key)
	);
	$: headerVersion = condensed ? headersCondensedF : headersF;
	$: curHeaders = [
		...(editable ? [editHeader] : []),
		...headerVersion,
		...customHeaders,
	];

	let tableContainerDiv = null;

	// hacky workaround to not being able to get entire rows
	function getRowElement(id) {
		return tableContainerDiv?.querySelector(`[data-row="${id}"]`);
	}

	let listeners = {};
	$: if (draggable && tableContainerDiv && !draggingRow) {
		try {
			for (let i = 0; i < problems.length; i++) {
				const row = problems[i];
				let elem = getRowElement(row.id);
				if (row.id in listeners) {
					elem?.removeEventListener("dragenter", listeners[row.id]);
				}
				listeners[row.id] = (e) => handleDragEnter(e, row);
				elem?.addEventListener("dragenter", listeners[row.id]);
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	let draggingRow = false;
	let draggedRow = null;
	let lastDraggedInd = null;

	function startDrag(e, row) {
		try {
			if (!draggable) return;
			draggingRow = true;
			draggedRow = row;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	function handleDragEnter(e, row) {
		try {
			if (!draggable) return;
			if (!draggingRow) return;
			if (row === draggedRow) return;

			e.preventDefault();
			const ind = problems.indexOf(row);
			lastDraggedInd = ind;
			problems.splice(problems.indexOf(draggedRow), 1);
			problems.splice(ind, 0, draggedRow);
			problems = problems;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	function endDrag(e) {
		try {
			if (!draggable) return;
			if (lastDraggedInd !== null) {
				dispatch("reorder", {
					id: draggedRow.id,
					to: lastDraggedInd,
				});
			}
			draggingRow = false;
			draggedRow = null;
			lastDraggedInd = null;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}
</script>

<svelte:window bind:outerWidth={width} />
<div class="align-items: right; display: flex;">
	<MultiSelect
		bind:selectedIds={showList}
		direction="top"
		size="sm"
		label="Filter visible columns"
		items={[
			{
				id: "front_id",
				text: "ID",
			},
			{
				id: "full_name",
				text: "Author",
			},
			{
				id: "topics_short",
				text: "Topics",
			},
			{
				id: "sub_topics",
				text: "SubTopic",
			},
			{
				id: "difficulty",
				text: "Difficulty",
			},
			{
				id: "problem_tests",
				text: "Test Name",
			},
			{
				id: "average_difficulty",
				text: "Avg. Difficulty",
			},
			{
				id: "average_quality",
				text: "Avg. Quality",
			},
			{
				id: "unresolved_count",
				text: "Unresolved Feedback",
			},
			{
				id: "created_at",
				text: "Created on",
			},
			{
				id: "edited_at",
				text: "Edited on",
			},
		]}
	/>
</div>

<div
	class="flex-dir-col"
	on:dragover={(e) => e.preventDefault()}
	bind:this={tableContainerDiv}
>
	<DataTable
		size="compact"
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
		pageSize={pageEnabled ? pageSize : undefined}
		page={pageEnabled ? page : undefined}
	>
		<Toolbar size="sm">
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows />
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:row let:header let:cell>
			<div>
				{#if cell.key === "edit"}
					<div class="pencil">
						<Link class="link" href={"/problems/" + row.id}
							><i class="ri-pencil-fill" style="font-size: 20px;" /></Link
						>
					</div>
				{:else if cell.key === "drag"}
					<div
						draggable={true}
						on:dragstart={(e) => startDrag(e, row)}
						on:dragend={(e) => endDrag(e)}
						style="visibility: {disableAll ? 'hidden' : 'visible'}"
						class="drag-div"
					>
						<div style="margin-left: 10px;"><Switcher /></div>
					</div>
				{:else if cell.key === "problem_number"}
					<div>
						{cell.value + 1}
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
				{:else if cell.key === "unresolved_count"}
					<div style="overflow: hidden;">
						{cell.value ?? 0}
					</div>
				{:else if cell.key === "average_difficulty" || cell.key === "average_quality"}
					<div style="overflow: hidden;">
						<Rating rating={cell.value / 2} size={15} count={true} round={2} />
					</div>
				{:else}
					<div style="overflow: hidden;">
						{cell.value == null || cell.value == "" ? "None" : cell.value}
					</div>
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="expanded-row" let:row>
			<Problem problem={row} />
		</svelte:fragment>
	</DataTable>
	{#if pageEnabled}
		<Pagination
			class="datatable"
			bind:pageSize
			bind:page
			totalItems={problems.length}
			pageSizeInputDisabled
		/>
	{/if}
</div>

<style>
	.drag-div {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
	}

	:global(.bx--data-table-container),
	:global(.bx--pagination) {
		width: 100% !important;
	}

	:global(.bx--table-expand__button) {
		width: 30px;
		height: 50px;
	}

	:global(.bx--list-box__field:focus) {
		outline-color: var(--primary);
	}
</style>
