<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Loading from "$lib/components/Loading.svelte";
	import { Select, SelectItem } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = true;
	let tests = [];
	let users = [];
	let curTest = 0;
	let curUser = 0;

	async function getUsers() {
		let { data: usersInfo, error } = await supabase
			.from("users")
			.select("id,full_name");
		if (error) alert(error);
		else users = usersInfo;
	}

	async function getTests() {
		let { data: testsInfo, error } = await supabase
			.from("tests")
			.select("id,test_name,tournaments(tournament_name,id)");
		if (error) alert(error);
		else tests = testsInfo;
	}

	async function newTestsolve() {
		if (curTest === 0) {
			alert("You need to put in a test!");
		} else if (curUser === 0) {
			alert("You need to put in a testsolver!");
		} else {
			const { data, error } = await supabase
				.from("testsolvers")
				.insert([{ test_id: curTest, solver_id: curUser }]);
			if (error) alert(error);
			else window.location.replace("/tests/testsolving/upcoming/" + data[0].id);
		}
	}

	getUsers();
	getTests();
	loading = false;
</script>

{#if loading}
	<Loading />
{:else}
	<div style="padding: 10px;">
		<h1>New Testsolve</h1>
		<Select labelText="Test" bind:selected={curTest}>
			<SelectItem value="0" text="" />
			{#each tests as test}
				<SelectItem
					value={test.id}
					text="{test.id} {test.test_name} - Tournament: {test.tournaments
						.id} {test.tournaments.tournament_name}"
				/>
			{/each}
		</Select>
		<br />
		<Select labelText="Testsolver" bind:selected={curUser}>
			<SelectItem value="0" text="" />
			{#each users as user}
				<SelectItem value={user.id} text="{user.full_name} ({user.id})" />
			{/each}
		</Select> <br />
		<Button action={newTestsolve} title="Add new testsolve" />
	</div>
{/if}
