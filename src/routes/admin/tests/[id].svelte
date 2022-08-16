<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		Form,
		TextInput,
		Select,
		SelectItem,
		TextArea,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Button from "$lib/components/Button.svelte";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let allUsers = [];
	let selectRef;

	async function getOneUser(id) {
		let { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", id)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
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
			alert(error.message);
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
		if (error) alert(error.message);
		allUsers = users.filter(
			(x) => !testCoordinators.some((tc) => tc.id === x.id)
		);
	}

	async function addTestCoordinator(e) {
		e.preventDefault(); // stop form from submitting
		const { data, error } = await supabase
			.from("test_coordinators")
			.insert({ coordinator_id: selectRef.value, test_id: testId });
		if (error) alert(error.message);
		getTest();
	}

	async function deleteTestCoordinator(testCoordinatorId) {
		const { data, error } = await supabase
			.from("test_coordinators")
			.delete()
			.eq("coordinator_id", testCoordinatorId);
		if (error) alert(error.message);
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
		if (error) alert(error.message);
	}

	getTest();
</script>

{#if loading}
	Test Loading...
{:else}
	<h1>Test {testId}: {test.test_name}</h1>
	<Form>
		<TextInput label="Name" bind:value={test.test_name} />
		<TextArea label="Description" bind:value={test.test_description} />
		<Button action={editTest} title="Edit Test" />
	</Form>
	<h3>Current coordinators:</h3>
	{#each testCoordinators as testCoordinator}
		<p>{testCoordinator.full_name} ({testCoordinator.id})</p>
		<Modal
			runHeader="Remove {testCoordinator.full_name}"
			del={true}
			onSubmit={() => deleteTestCoordinator(testCoordinator.id)}
		/>
	{/each}
	<Form>
		<Select bind:ref={selectRef}>
			{#each allUsers as user}
				<SelectItem value={user.id} text="{user.full_name} ({user.id})" />
			{/each}
		</Select>
		<Button action={addTestCoordinator} title="Add Test Coordinator" />
	</Form>
{/if}
