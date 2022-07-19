<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		Form,
		TextInput,
		Button,
		Select,
		SelectItem,
		TextArea,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";

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
			.select("*,test_coordinators(users(*))")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
		}
		test = tests;

		testCoordinators = test.test_coordinators.map((x) => x.users);
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

	async function addTestCoordinator() {
		const { data, error } = await supabase
			.from("test_coordinators")
			.insert([{ coordinator_id: selectRef.value, test_id: testId }]);
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
		<Button on:click={editTest}>Edit Test</Button>
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
		<Button on:click={addTestCoordinator}>Add Test Coordinator</Button>
	</Form>
{/if}
