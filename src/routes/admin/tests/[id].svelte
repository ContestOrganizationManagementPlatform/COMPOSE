<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		Form,
		TextInput,
		Button,
		Select,
		SelectItem,
	} from "carbon-components-svelte";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let allUsers;

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

		let { data: test_coordinators, error2 } = await supabase
			.from("test_coordinators")
			.select("coordinator_id");
		if (error) {
			alert(error.message);
		}
		for (let test_coordinator of test_coordinators) {
			testCoordinators.push(await getOneUser(test_coordinator.coordinator_id));
		}
		loading = false;
		console.log(testCoordinators);
		console.log(test);
	}

	async function getAllUsers() {
		let { data: users, error } = await supabase.from("users").select("*");
		if (error) alert(error.message);
		allUsers = users;
	}

	getTest();
	getAllUsers();
</script>

{#if loading}
	Test Loading...
{:else}
	<h1>Test {testId}: {test.test_name}</h1>
	<Form>
		{#each testCoordinators as testCoordinator}
			<Select selected={testCoordinator.id}>
				{#each allUsers as user}
					<SelectItem value={user.id} text="{user.full_name} ({user.id})" />
				{/each}
			</Select>
		{/each}
	</Form>
{/if}
