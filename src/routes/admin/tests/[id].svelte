<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		TextInput,
		Select,
		SelectItem,
		TextArea,
		InlineNotification,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Button from "$lib/components/Button.svelte";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let allUsers = [];
	let selectRef;

	let errorTrue = false;
	let errorMessage = "";

	async function getOneUser(id) {
		let { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", id)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		return user;
	}

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select("*")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		test = tests;

		let { data: queriedCoordinators, error2 } = await supabase
			.from("test_coordinators")
			.select("*,users(*)")
			.eq("test_id", testId);
		testCoordinators = queriedCoordinators.map((tc) => tc.users);
		loading = false;
		await getAllUsers();
	}

	async function getAllUsers() {
		let { data: users, error } = await supabase
			.from("users")
			.select("*,test_coordinators(*)")
			.order("full_name");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		allUsers = users.filter(
			(x) => !testCoordinators.some((tc) => tc.id === x.id)
		);
	}

	async function addTestCoordinator(e) {
		e.preventDefault(); // stop form from submitting
		const { data, error } = await supabase
			.from("test_coordinators")
			.insert({ coordinator_id: selectRef.value, test_id: testId });
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		getTest();
	}

	async function deleteTestCoordinator(testCoordinatorId) {
		const { data, error } = await supabase
			.from("test_coordinators")
			.delete()
			.eq("coordinator_id", testCoordinatorId);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		getTest();
	}

	async function editTest() {
		const { data, error } = await supabase
			.from("tests")
			.update({
				test_name: test.test_name,
				test_description: test.test_description,
			})
			.eq("id", testId);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
	}

	async function deleteTest() {
		const { data, error } = await supabase
			.from("tests")
			.delete()
			.eq("id", testId);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else window.location.replace("/admin/tests");
	}

	getTest();
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

<div style="padding: 10px">
	{#if loading}
		<p>Loading...</p>
	{:else}
		<h1>Test {testId}: {test.test_name}</h1>
		<br />
		<form on:submit|preventDefault>
			<TextInput label="Name" bind:value={test.test_name} />
			<br />
			<TextArea label="Description" bind:value={test.test_description} />
			<br />
			<Button action={editTest} title="Edit Test" />
		</form>
		<br />
		<h3><strong>Current Test Coordinators</strong></h3>
		{#if testCoordinators.length === 0}
			<p>There are no test coordinators</p>
		{:else}
			<div class="grid" style="padding: 5px;">
				{#each testCoordinators as testCoordinator}
					<div class="flex">
						<p
							style="margin-right: 10px; margin-top: auto; margin-bottom: auto;"
						>
							{testCoordinator.full_name}
						</p>
						<Modal
							runHeader="Remove {testCoordinator.full_name}"
							del={true}
							onSubmit={() => deleteTestCoordinator(testCoordinator.id)}
						/>
					</div>
				{/each}
			</div>
		{/if} <br /> <br />
		<h3><strong>Add Test Coordinators</strong></h3>
		<form on:submit|preventDefault>
			<Select bind:ref={selectRef}>
				{#each allUsers as user}
					<SelectItem value={user.id} text="{user.full_name} ({user.id})" />
				{/each}
			</Select>
			<br />
			<Button action={addTestCoordinator} title="Add Test Coordinator" />
		</form>
		<br />
		<form on:submit|preventDefault>
			<Modal runHeader="Delete Test" onSubmit={deleteTest} />
		</form>
	{/if}
</div>
