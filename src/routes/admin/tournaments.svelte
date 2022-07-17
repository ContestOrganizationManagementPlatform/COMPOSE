<script>
	import { Form, TextInput, Button } from "carbon-components-svelte";
	import { supabase } from "$lib/supabaseClient";
	import Menu from "$lib/components/Menu.svelte";

	let tournaments = [];
	let tournamentName = "";
	let tournamentDate = "";

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			alert(error);
		}
		tournaments = tournamentList;
	}

	async function createTournament() {
		const { data, error } = await supabase
			.from("tournaments")
			.insert([
				{ tournament_name: tournamentName, tournament_date: tournamentDate },
			]);
		getTournaments();
	}

	getTournaments();
</script>

<Menu path="admin/tournaments" />
<h1>Tournaments</h1>
{#each tournaments as tournament}
	ID: {tournament.id} <br />
	Name: {tournament.tournament_name} <br />
	Date: {tournament.tournament_date ?? "None"} <br /> <br />
{/each}

<Form>
	<TextInput bind:value={tournamentName} label="Name" placeholder="Name" />
	<TextInput bind:value={tournamentDate} label="Date" placeholder="Date" />
	<Button on:click={createTournament}>Create New Tournament</Button>
</Form>
