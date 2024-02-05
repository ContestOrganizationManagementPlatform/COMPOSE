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
	import { LogarithmicScale } from "chart.js";

	export let problems = [];
	export let selectable = false;
	export let stickyHeader = false;
	export let selectedItems = [];
	export let nonselectableItems = [];
	export let sortKey = "created_at";
	export let sortDirection = "descending";
	export let editable = true;
	export let disableAll = false; // disables everything from being selectable
	export let customHeaders = [];
	export let draggable = false;
	export let pageEnabled = true;
	export let minWidth = 100;

	export let showList = [
		"full_name",
		"topics_short",
		"sub_topics",
		"average_difficulty",
		"average_quality",
		"unresolved_count",
	];

	const dispatch = createEventDispatcher();

	let width = 0;
	$: maxCols = Math.floor((width - 100) / minWidth);
	$: colWidth = (width - 100) / Math.min(maxCols, showList.length);

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
			key: "full_name",
			value: "Author",
			short: "Author",
			icon: "ri-user-fill",
		},
		{
			key: "topics_short",
			value: "Topics",
			short: "Topics",
			icon: "ri-pie-chart-2-fill",
		},
		{
			key: "problem_tests",
			value: "Tests",
			short: "Tests",
			icon: "ri-archive-fill",
		},
		{
			key: "sub_topics",
			value: "Subtopics",
			short: "SubTps",
			icon: "ri-node-tree",
		},
		{
			key: "average_difficulty",
			value: "Difficulty",
			short: "Diff",
			icon: "ri-bar-chart-2-fill",
		},
		{
			key: "average_quality",
			value: "Quality",
			short: "Qlty",
			icon: "ri-star-fill",
		},
		{
			key: "unresolved_count",
			value: "Feedback",
			short: "Fdbk",
			icon: "ri-flag-fill",
		},
		{
			key: "created_at",
			value: "Created",
			short: "Create",
			icon: "ri-calendar-event-fill",
		},
		{
			key: "edited_at",
			value: "Edit",
			icon: "ri-calendar-todo-fill",
		},
	];

	$: headersF = headers.filter((row) => showList.includes(row.key));
	$: curHeaders = [
		...(editable ? [editHeader] : []),
		...[
			{
				key: "front_id",
				value: "ID",
				icon: "ri-key-2-fill",
				sort: sortIDs,
				width: "90px",
			},
		],
		...headersF.slice(0, maxCols),
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

<svelte:window />
<div bind:clientWidth={width} class="align-items: right; display: flex;">
	<MultiSelect
		bind:selectedIds={showList}
		direction="top"
		size="sm"
		label="Filter visible columns"
		items={[
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
				text: "Feedback",
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
		{sortKey}
		{sortDirection}
		{selectable}
		{stickyHeader}
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
		<svelte:fragment slot="cell-header" let:header>
			{#if colWidth > 120}
				<i class={header.icon} /> {header.value}
			{:else}
				<div style="display: flex; align-items: flex-center;">
					<i
						class={header.icon}
						style="display: flex; align-items: flex-center;"
					/>
					{header.short ? header.short : header.value}
				</div>
			{/if}
		</svelte:fragment>
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
				{:else if cell.key === "topics"}
					{console.log(cell.value)}
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
					<div
						style="overflow: hidden; display: flex; align-items: flex-start;"
					>
						<Rating
							rating={cell.value}
							size={15}
							count={true}
							round={2}
							style="align-items: left"
						/>
					</div>
				{:else}
					<div style="overflow: hidden;">
						{cell.value == null || cell.value == "" ? "-" : cell.value}
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

	.rating {
		align-items: left;
	}

	:global(.bx--data-table--sticky-header) {
		max-height: 800px;
	}

	:global(.bx--table-header-label) {
		white-space: nowrap;
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
