<script>
	import { page } from "$app/stores";
	import {
		Select,
		SelectItem,
		DataTable,
		Link,
	} from "carbon-components-svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Launch from "carbon-icons-svelte/lib/Launch.svelte";
	import TestsolveList from "$lib/components/TestsolveList.svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";
	import {
		getTestInfo,
		getAllUsersOrder,
		getTestTestsolves,
		addTestsolver,
		deleteTestsolve,
	} from "$lib/supabase";

	let testId = $page.params.id;
	let loading = true;
	let selectRef;
	let testsolves;
	let test;
	let allUsers = [];

	let tableData = [];

	async function getTest() {
		try {
			loading = true;
			test = await getTestInfo(testId);
			console.log("TEST", test);
			getAllUsers();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function onDelete(id) {
		await deleteTestsolve(id);
		await getTestsolves();
	}

	async function getTestsolves() {
		try {
			const testsolveInfo = await getTestTestsolves(
				testId,
				"*,users(full_name,initials),tests(test_name)"
			);
			console.log(testsolveInfo);
			testsolves = testsolveInfo.map((e) => ({
				id: e.id,
				solver_id: e.solver_id,
				test_id: e.test_id,
				solver_name: e.users.full_name,
				solver_initials: e.users.initials,
				test_name: e.tests.test_name,
				start_time: e.start_time ? formatDate(new Date(e.start_time)) : null,
				elapsed: e.time_elapsed,
				test_version: e.test_version,
				status: e.start_time
					? e.completed
						? "Done"
						: "Started"
					: "Not Started",
			}));
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getAllUsers() {
		try {
			allUsers = await getAllUsersOrder("full_name", "*,test_coordinators(*)");
			getTestsolves();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}
	getTest();

	async function addNewTestsolver() {
		try {
			await addTestsolver({ test_id: testId, solver_id: selectRef.value });
			getTestsolves();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
		<h3><strong>Add Testsolves</strong></h3>
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
				<Button action={addNewTestsolver} title="Add Testsolver" />
			</form>
		</div>
		<br /> <br />
		<h3><strong>Current Testsolves</strong></h3>
		{#if testsolves.length === 0}
			<p>There are no testsolves</p>
		{:else}
			<TestsolveList {onDelete} {testsolves} />
		{/if}
	{/if}
</div>
