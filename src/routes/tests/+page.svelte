<script>
	import { supabase } from "$lib/supabaseClient.ts";
	import Button from "$lib/components/Button.svelte";
	import {
		DataTable,
		Link,
		InlineNotification,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination,
	} from "carbon-components-svelte";

	let rows = [];
	let pageSize = 25;
	let page = 1;
	let tournaments = {};

	let errorTrue = false;
	let errorMessage = "";

	async function getTests() {
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*,tournaments(tournament_name)");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}

		let rowValues = [];

		for (const test of testList) {
			if (!tournaments[test.tournament_id]) {
				tournaments[test.tournament_id] = {
					name: test.tournaments.tournament_name,
					tests: [],
				};
			}
			tournaments[test.tournament_id].tests.push(test);
			rowValues.push({
				id: test.id,
				edit: test.id,
				competition: test.tournaments.tournament_name,
				name: test.test_name,
				description: test.test_description
			})
		}

		rows = rowValues;
	}

	getTests();
</script>

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

<br />
<h1>View Tests</h1>
<br />
<div style="padding: 10px;">
	<DataTable
		sortable
		size="compact"
		headers={[
			{ key: "edit", value: "", width: "50px" },
			{ key: "id", value: "ID", width: "100px" },
			{ key: "competition", value: "Competition" },
			{ key: "name", value: "Name" },
			{ key: "description", value: "Description" },
		]}
		{rows}
		{pageSize}
		{page}
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
						<Link class="link" href={"/tests/" + row.id}
							><i class="ri-pencil-fill" /></Link
						>
					</div>
				{:else}
					<div style="overflow: hidden;">
						{cell.value == null || cell.value == "" ? "None" : cell.value}
					</div>
				{/if}
			</div>
		</svelte:fragment>
	</DataTable>

	<Pagination
		bind:pageSize
		bind:page
		totalItems={rows.length}
		pageSizeInputDisabled
	/>
</div>

<style>
	:global(.bx--search-input:focus:not([disabled])) {
		outline: none !important;
	}
</style>
