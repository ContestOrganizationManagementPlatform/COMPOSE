<script>
	import { supabase } from "$lib/supabaseClient";
	import { Select, SelectItem } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";

	let finalUser = "";
	let finalTest = "";
	let users = [];
	let tests = [];
	let loading = true;

	async function getUsers() {
		let { data: usersInfo, error } = await supabase.from("users").select("*");
		if (error) alert(error.message);
		else users = usersInfo;
	}

	async function getTests() {
		let { data: testsInfo, error } = await supabase.from("tests").select("*");
		if (error) alert(error.message);
		else tests = testsInfo;
		loading = false;
	}

	getUsers();
	getTests();
</script>

<h1>Create New Testsolve</h1>

{#if loading}
	<p>Loading...</p>
{:else}
	<Select labelText="Testsolver" bind:selected={finalUser}>
		<SelectItem text="" value="" />
		{#each users as user}
			<SelectItem
				text={user.full_name + " (" + user.id + ")"}
				value={user.id}
			/>
		{/each}
	</Select>
	<Select labelText="Test" bind:selected={finalTest}>
		<SelectItem text="" value="" />
		{#each tests as test}
			<SelectItem
				text={test.test_name + " (" + test.id + ")"}
				value={test.id}
			/>
		{/each}
	</Select>
	<Button
		title="Submit"
		action={async () => {
			if (finalTest === "" || finalUser === "") {
				alert("Please select a test and a user");
			} else {
				console.log(finalTest);
				console.log(finalUser);
				const { data, error } = await supabase
					.from("testsolvers")
					.insert([{ test_id: finalTest, solver_id: finalUser }]);
				if (error) alert(error.message);
			}
		}}
	/>
{/if}
