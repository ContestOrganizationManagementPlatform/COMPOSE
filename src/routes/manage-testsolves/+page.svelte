<script>
	import { supabase } from "$lib/supabaseClient";
	import { formatDate } from "$lib/formatDate";
	import {
		DataTable,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = true;
	let testsolves = [];
	let pageSize = 25;
	let page = 1;

	async function getUpcomingTestsolves() {
		loading = true;

		let testsolves1 = [];

		let { data: testsolveInfo, error } = await supabase
			.from("testsolves")
			.select("*,users(full_name,initials),tests(test_name)");
		if (error) alert(error.message);
		else {
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
		}

		let testsolves2 = [];

		let { data: testsolveInfo2, error2 } = await supabase
			.from("testsolvers")
			.select("*,users(full_name,initials),tests(test_name)");
		if (error2) alert(error2.message);
		else {
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
		}

		testsolves = testsolves1.concat(testsolves2);
		loading = false;
	}

	getUpcomingTestsolves();
</script>

<br />
<h1 style="margin-bottom: 5px;">Admin Testsolves</h1>
<Button href="/manage-testsolves/upcoming/new" title="Create new testsolve" />

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
								><i class="ri-pencil-fill" /></Link
							>
						</div>
					{:else}
						<div class="pencil">
							<Modal
								del
								runHeader="Delete Testsolve"
								onSubmit={async () => {
									const { data, error } = await supabase
										.from("testsolvers")
										.delete()
										.eq("id", row.id);
									if (error) alert(error.message);
									else getUpcomingTestsolves();
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
