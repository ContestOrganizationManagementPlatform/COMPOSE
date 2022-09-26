<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		InlineNotification,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Button from "$lib/components/Button.svelte";

	let testId = $page.params.id;
	let loading = true;
	let selectRef;
	let testsolvers;
	let test;
	let allUsers = [];

	let errorTrue = false;
	let errorMessage;

	async function getTest() {
		let { data, error } = await supabase
			.from("tests")
			.select("test_name")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		test = data;

		getTestsolvers();
	}

	async function getTestsolvers() {
		let { data, error } = await supabase
			.from("testsolvers")
			.select("solver_id,users(full_name)")
			.eq("test_id", testId);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}

		testsolvers = data;
		getAllUsers();
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
			errorTrue = true;
			errorMessage = error.message;
		}
		getTestsolvers();
	}

	async function deleteTestsolver(id) {
		const { error } = await supabase
			.from("testsolvers")
			.delete({ returning: "minimal" })
			.eq("solver_id", id);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		getTestsolvers();
	}
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
		<Button href={`/tests/${testId}/testsolve`} title="Go back" />
		<br /><br />
		<h3><strong>Current Testsolvers</strong></h3>
		{#if testsolvers.length === 0}
			<p>There are no testsolvers</p>
		{:else}
			<div class="grid" style="padding: 5px;row-gap: 10px;">
				{#each testsolvers as testsolver}
					<div class="flex">
						<p
							style="margin-right: 10px; margin-top: auto; margin-bottom: auto;"
						>
							{testsolver.users.full_name}
						</p>
						<Modal
							runHeader="Remove {testsolver.users.full_name}"
							del={true}
							onSubmit={() => deleteTestsolver(testsolver.solver_id)}
						/>
					</div>
				{/each}
			</div>
		{/if} <br /> <br />
		<h3><strong>Add Testsolvers</strong></h3>
		<form on:submit|preventDefault>
			<Select bind:ref={selectRef}>
				{#each allUsers as user}
					<SelectItem value={user.id} text="{user.full_name} ({user.id})" />
				{/each}
			</Select>
			<br />
			<Button action={addTestsolver} title="Add Testsolver" />
		</form>
	{/if}
</div>
