<script>
	import { Select, SelectItem } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";
	import { getAllTests, getAllUsers, addTestsolver, getTestInfo } from "$lib/supabase";

	let finalUser = "";
	let finalTest = "";
	let users = [];
	let tests = [];
	let loading = true;

	async function getUsers() {
		try {
			users = await getAllUsers();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getTests() {
		try {
			tests = await getAllTests();
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getUsers();
	getTests();
</script>

<br />
<h1>Create New Testsolve</h1>

<div style="padding: 20px;">
	{#if loading}
		<Loading />
	{:else}
		<Select labelText="Testsolver" bind:selected={finalUser}>
			<SelectItem text="" value="" />
			{#each users as user}
				<SelectItem text={user.full_name} value={user.id} />
			{/each}
		</Select>
		<br />
		<Select labelText="Test" bind:selected={finalTest}>
			<SelectItem text="" value="" />
			{#each tests as test}
				<SelectItem text={test.test_name} value={test.id} />
			{/each}
		</Select>
		<br />
		<Button
			title="Submit"
			action={async () => {
				try {
					if (finalTest === "" || finalUser === "") {
						toast.error("Please select a test and a user");
					} else {
						await addTestsolver({ test_id: finalTest, solver_id: finalUser });
						const testInfo = await getTestInfo(finalTest);

						await fetch("/api/discord-dm", {
							method: "POST",
							body: JSON.stringify({
								userId: finalUser,
								message: "You have been assigned a test for the following test: " + testInfo.test_name,
							}),
						});

						toast.success("Success! Added testsolve.");
					}
				} catch (error) {
					handleError(error);
					toast.error(error.message);
				}
			}}
		/>
	{/if}
</div>
