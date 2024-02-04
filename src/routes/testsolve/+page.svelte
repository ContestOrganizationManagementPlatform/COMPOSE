<script lang="ts">
	import { DataTable, Link } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import { formatDate } from "$lib/formatDate";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import Launch from "carbon-icons-svelte/lib/Launch.svelte";
	import {
		getAllTests,
		getThisUserRole,
		getThisUser,
		getSolverTests,
		getAllTestsolves,
		getSelectTestsolves,
	} from "$lib/supabase";

	let loading = true;

	let availableTests = [];
	let tableData = [];

	let user;
	(async () => {
		user = await getThisUser();
		await getTestsolves();
	})();

	async function getTestsolves() {
		try {
			const tests = await getSolverTests(user.id, "test_id,tests(test_name)");
			availableTests = tests.map((x) => ({
				name: x.tests.test_name,
				id: x.test_id,
				solves: [],
				started: false,
			}));

			getFinishedSolves();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getFinishedSolves() {
		try {
			let finishedSolves;
			finishedSolves = await getSelectTestsolves(
				user.id,
				"*,users(full_name,initials)"
			);
			for (const solve of finishedSolves) {
				let test = availableTests.find((ts) => ts.id === solve.test_id);
				if (test) {
					test.solves.push(solve);
					// if this solve is uncompleted
					if (!solve.completed && solve.solver_id === user.id) {
						test.completed = false;
					}
				}
			}
			availableTests = availableTests;

			for (var solve of finishedSolves) {
				let status;
				if (!solve.start_time) {
					status = "Not started";
				} else if (!solve.completed) {
					status = "Incomplete";
				} else {
					status = "Completed";
				}

				tableData.push({
					id: solve.id,
					date: solve.end_time
						? formatDate(new Date(solve.end_time)).split(",")[0]
						: "N/A",
					time: solve.end_time
						? formatDate(new Date(solve.end_time)).split(",")[1]
						: "N/A",
					person: solve.users.full_name + " (" + solve.users.initials + ")",
					test: availableTests.find((ts) => ts.id === solve.test_id).name,
					status,
					testVersion: solve.test_version,
				});
			}
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}
</script>

<br />
<h1>Testsolving</h1>
<br />
<div>
	{#if loading}
		<Loading />
	{:else if availableTests.length === 0}
		<p>No available testsolves!</p>
	{:else}
		<h4><strong>Open testsolves:</strong></h4>
		<div class="row">
			{#each availableTests as test}
				<div class="box">
					<h3><strong>{test.name}</strong></h3>
					<div style="margin-top: 10px">
						<Button
							href="/tests/{test.id}/testsolve/solve"
							title={!test.started ? "Begin solve" : "Continue solve"}
						/>
					</div>
				</div>
			{/each}
		</div>
		<br />
		<h4><strong>Past testsolves:</strong></h4>
		<div style="padding: 10px">
			<DataTable
				sortable
				size="compact"
				pageSize={10}
				headers={[
					{ key: "id", value: "ID" },
					{ key: "date", value: "End Date" },
					{ key: "time", value: "End Time" },
					{ key: "person", value: "Person" },
					{ key: "test", value: "Test" },
					{ key: "status", value: "Status" },
					{ key: "testVersion", value: "Test Version" },
				]}
				rows={tableData}
			>
				<svelte:fragment slot="cell" let:row let:cell>
					{#if cell.key === "id"}
						<Link icon={Launch} href="/testsolve/{cell.value}" target="_blank"
							>{cell.value}</Link
						>
					{:else}
						{cell.value}
					{/if}
				</svelte:fragment>
			</DataTable>
			<br />
		</div>
	{/if}
</div>

<style>
	.box {
		background-color: var(--text-color-light);
		border: 1px solid var(--primary);
		margin: 10px;
		padding: 10px 20px;
	}
</style>
