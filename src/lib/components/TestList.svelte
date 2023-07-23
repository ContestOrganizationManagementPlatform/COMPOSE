<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		DataTable,
		DataTableSkeleton,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination,
	} from "carbon-components-svelte";
	import { formatDate } from "$lib/formatDate.js";
	import Problem from "$lib/components/Problem.svelte";
	import Switcher from "carbon-icons-svelte/lib/Switcher.svelte";
	import { createEventDispatcher } from "svelte";
	import toast from "svelte-french-toast";

	export let tests = [];
	export let condensed = false;
	export let selectable = false;
	export let selectedItems = [];
	export let nonselectableItems = [];
	export let editable = true;
	export let disableAll = false; // disables everything from being selectable
	export let customHeaders = [];
	export let draggable = false;
	export let pageEnabled = true;
	export let problemCounts = {};
	const dispatch = createEventDispatcher();

	let width = 0;
	let mobileFriendly = {
		Algebra: "Alg",
		Mixed: "Mx",
		"Number Theory": "NT",
		Combination: "Comb",
		Geometry: "Geo",
	};

	let pageSize = 10;
	let page = 1;
	(async () => {
		try {
			// let { data: newProblems, error } = await supabase
			// 	.from("full_problems")
			// 	.select("*")
			// 	.order("front_id");
			// problems = newProblems;

			let { data: problemCountsData, error2 } = await supabase
				.from("problem_counts")
				.select("*");
			if (error2) throw error2;
			problemCounts = problemCountsData.sort(
				(a, b) => b.problem_count - a.problem_count
			);
		} catch (error) {
			toast.error(error.message);
		}
	})();
	let editHeader = { key: "edit", value: "", width: "20px" };

	let headers = [
		{ key: "id", value: "ID", width: "80px" },
		{ key: "test_coordinator", value: "TC" },
		{ key: "test_name", value: "Test" },
		{
			key: "test_description",
			value: width > 700 ? "Test Description" : "Test Info.",
		},
	];

	let headersCondensed = [
		{ key: "front_id", value: "ID" },
		{ key: "full_name", value: "Author" },
		{ key: "topics_short", value: "Topics" },
		{ key: "sub_topics", value: width > 700 ? "SubTopic" : "SubTop" },
		{ key: "difficulty", value: width > 700 ? "Difficulty" : "Diff." },
	];

	let headerVersion = condensed ? headersCondensed : headers;

	let curHeaders = [
		...(editable ? [editHeader] : []),
		...customHeaders,
		...headerVersion,
	];

	let tableContainerDiv = null;

	// hacky workaround to not being able to get entire rows
	function getRowElement(id) {
		return tableContainerDiv?.querySelector(`[data-row="${id}"]`);
	}

	let listeners = {};
	$: if (draggable && tableContainerDiv && !draggingRow) {
		for (let i = 0; i < tests.length; i++) {
			const row = tests[i];
			let elem = getRowElement(row.id);
			if (row.id in listeners) {
				elem?.removeEventListener("dragenter", listeners[row.id]);
			}
			listeners[row.id] = (e) => handleDragEnter(e, row);
			elem?.addEventListener("dragenter", listeners[row.id]);
		}
	}

	let draggingRow = false;
	let draggedRow = null;
	let lastDraggedInd = null;

	function startDrag(e, row) {
		if (!draggable) return;
		draggingRow = true;
		draggedRow = row;
	}

	function handleDragEnter(e, row) {
		if (!draggable) return;
		if (!draggingRow) return;
		if (row === draggedRow) return;

		e.preventDefault();
		const ind = tests.indexOf(row);
		lastDraggedInd = ind;
		tests.splice(tests.indexOf(draggedRow), 1);
		tests.splice(ind, 0, draggedRow);
		tests = tests;
	}

	function endDrag(e) {
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
	}
</script>

<svelte:window bind:outerWidth={width} />

<div
	class="flex-dir-col"
	on:dragover={(e) => e.preventDefault()}
	bind:this={tableContainerDiv}
>
	<DataTable
		size="short"
		expandable
		sortable
		{selectable}
		bind:selectedRowIds={selectedItems}
		nonSelectableRowIds={disableAll
			? tests.map((pb) => pb.id)
			: nonselectableItems}
		class="datatable"
		headers={curHeaders}
		rows={tests}
		pageSize={pageEnabled ? pageSize : undefined}
		page={pageEnabled ? page : undefined}
	>
		<Toolbar size="sm">
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows />
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:row let:cell let:rowIndex>
			<div>
				{#if cell.key === "edit"}
					<div class="pencil">
						<Link class="link" href={"/admin/tests/" + row.id}
							><i class="ri-pencil-fill" /></Link
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
						<Switcher />
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
				{:else}
					<div style="overflow: hidden;">
						{cell.value == null || cell.value == "" ? "None" : cell.value}
					</div>
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="expanded-row" let:row>
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
		</svelte:fragment>
	</DataTable>
	{#if pageEnabled}
		<Pagination
			class="datatable"
			bind:pageSize
			bind:page
			totalItems={tests.length}
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
</style>
