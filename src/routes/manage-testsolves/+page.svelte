<script>
	import { formatDate } from "$lib/formatDate";
	import {
		DataTable,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import toast from "svelte-french-toast";
	import Button from "$lib/components/Button.svelte";
	import { handleError } from "$lib/handleError.ts";
	import { deleteTestsolve, getAllTestsolvers, getAllTestsolves } from "$lib/supabase";

	let loading = true;
	let testsolves = [];
	let pageSize = 25;
	let page = 1;

	async function getUpcomingTestsolves() {
		try {
			loading = true;

			let testsolves1 = [];
			const testsolveInfo = await getAllTestsolves("*,users(full_name,initials),tests(test_name)");
			testsolves1 = testsolveInfo.map((e) => ({
				id: e.id,
				solver_id: e.solver_id,
				test_id: e.test_id,
				solver_name: e.users.full_name,
				solver_initials: e.users.initials,
				test_name: e.tests.test_name,
				start_time: formatDate(new Date(e.start_time)),
				end_time: formatDate(new Date(e.end_time)),
				feedback: e.feedback,
				test_version: e.test_version,
				status: "Past",
			}));

			let testsolves2 = [];
			const testsolveInfo2 = await getAllTestsolvers("*,users(full_name,initials),tests(test_name)");
			testsolves2 = testsolveInfo2.map((e) => ({
				id: e.id,
				solver_id: e.solver_id,
				test_id: e.test_id,
				solver_name: e.users.full_name,
				solver_initials: e.users.initials,
				test_name: e.tests.test_name,
				start_time: "N/A",
				end_time: "N/A",
				feedback: "N/A",
				status: "Upcoming",
			}));

			testsolves = testsolves1.concat(testsolves2);
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getUpcomingTestsolves();

	$: testsolvesSameWeek = testsolves
		.filter((row) => {
			var today = new Date();
			var nextWeek = Date.parse(
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
			);

			if (nextWeek > new Date(row.end_time)) {
				return false;
			} else {
				return true;
			}
		})
		.map((row) => row.id);

	$: selectors = testsolvesSameWeek.map((id) => `[data-row="${id}"]`).join(",");

	$: styles = `
		<style>
		${selectors} {
			outline: 1.5px solid var(--primary);
		}
		<\/style>
	`;
</script>

<svelte:head>
	{@html styles}
</svelte:head>

<br />
<h1 style="margin-bottom: 5px;">Admin Testsolves</h1>
<Button href="/manage-testsolves/new" title="Create new testsolve" />

<div style="padding: 20px">
	<DataTable
		sortable
		size="compact"
		headers={[
			{ key: "id", value: "ID", width: "100px" },
			{ key: "status", value: "Status" },
			{ key: "test_name", value: "Test Name" },
			{ key: "solver_name", value: "Test Solver" },
			{ key: "start_time", value: "Start Time" },
			{ key: "end_time", value: "End Time" },
			{ key: "feedback", value: "Feedback" },
			{ key: "edit", value: "", width: "100px" },
		]}
		rows={testsolves}
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
					{#if row.status == "Past"}
						<div class="pencil">
							<Link class="link" href={"/testsolve/" + row.id}
								><i class="ri-pencil-fill" style="font-size: 20px;" /></Link
							>
						</div>
					{:else}
						<div class="pencil">
							<Modal
								del
								runHeader="Delete Testsolve"
								onSubmit={async () => {
									try {
										await deleteTestsolve(row.id);
									} catch (error) {
										toast.error(error.message);
									}
								}}
							/>
						</div>
					{/if}
				{:else}
					<div style="overflow: hidden;">
						{cell.value == null || cell.value == "" ? "None" : cell.value}
					</div>
				{/if}
			</div>
		</svelte:fragment>
	</DataTable>
</div>
