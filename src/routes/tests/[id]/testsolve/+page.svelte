<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		DataTable,
		Link,
	} from "carbon-components-svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Launch from "carbon-icons-svelte/lib/Launch.svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";

	let testId = $page.params.id;
	let loading = true;
	let selectRef;
	let testsolvers;
	let test;
	let allUsers = [];

	let tableData = [];

	async function getTest() {
		let { data, error } = await supabase
			.from("tests")
			.select("test_name")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			toast.error(error.message);
		}
		test = data;

		getTestsolvers();
	}

	async function getTestsolvers() {
		let { data, error } = await supabase
			.from("testsolvers")
			.select("solver_id,users(full_name,initials)")
			.eq("test_id", testId);
		if (error) {
			toast.error(error.message);
		}

		testsolvers = data;

		testsolvers.forEach((user) => {
			tableData.push({
				id: user.solver_id,
				testsolver: user.users.full_name + " (" + user.users.initials + ")",
				status: "x",
				testsolve: "x",
				delete: user.solver_id,
			});
		});

		getAllUsers();
	}

	async function getAllUsers() {
		let { data: users, error } = await supabase
			.from("users")
			.select("*,test_coordinators(*)")
			.order("full_name");
		if (error) {
			toast.error(error.message);
		}
		allUsers = users.filter(
			(x) => !testsolvers.some((ts) => ts.solver_id === x.id)
		);
		loading = false;
	}

	getTest();

	async function addTestsolver() {
		let { error } = await supabase
			.from("testsolvers")
			.insert([{ test_id: testId, solver_id: selectRef.value }], {
				returning: "minimal",
			});
		if (error) {
			toast.error(error.message);
		}
		getTestsolvers();
	}

	async function deleteTestsolver(id) {
		const { error } = await supabase
			.from("testsolvers")
			.delete({ returning: "minimal" })
			.eq("solver_id", id);
		if (error) {
			toast.error(error.message);
		}
		getTestsolvers();
	}
</script>

<div style="padding: 10px">
	{#if loading}
		<Loading />
	{:else}
		<h1>Test {testId}: {test.test_name}</h1>
		<br />
		<Button href={`/tests/${testId}`} title="Go back" />
		<br /><br />
		<h3><strong>Add Testsolvers</strong></h3>
		<div class="flex">
			<form on:submit|preventDefault style="width: 50%">
				<Select bind:ref={selectRef}>
					{#each allUsers as user}
						<SelectItem
							value={user.id}
							text={user.full_name + " (" + user.initials + ")"}
						/>
					{/each}
				</Select>
				<br />
				<Button action={addTestsolver} title="Add Testsolver" />
			</form>
		</div>
		<br /> <br />
		<h3><strong>Current Testsolvers</strong></h3>
		{#if testsolvers.length === 0}
			<p>There are no testsolvers</p>
		{:else}
			<DataTable
				sortable
				size="compact"
				pageSize={10}
				headers={[
					{ key: "testsolver", value: "Testsolver" },
					{ key: "status", value: "Status" },
					{ key: "testsolve", value: "Testsolve" },
					{ key: "delete", value: "Delete" },
				]}
				rows={tableData}
			>
				<svelte:fragment slot="cell" let:row let:cell>
					{#if cell.key === "testsolve"}
						<Link icon={Launch} href="/testsolve/{cell.value}" target="_blank"
							>{cell.value}</Link
						>
					{:else if cell.key === "delete"}
						<Modal
							runHeader="Remove testsolver"
							del={true}
							onSubmit={() => deleteTestsolver(cell.value)}
						/>
					{:else}
						{cell.value}
					{/if}
				</svelte:fragment>
			</DataTable>
		{/if}
	{/if}
</div>
