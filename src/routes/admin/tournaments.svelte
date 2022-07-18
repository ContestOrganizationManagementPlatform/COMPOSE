<script>
	import { Form, TextInput, Button } from "carbon-components-svelte";
	import { supabase } from "$lib/supabaseClient";
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

<br />
<h1>View Tournaments</h1>
<br />
<div class="flex profileButtons">
	<Form class="tournamentForm">
		<TextInput
			on:keyup={(e) => {
				if (e.key === "Enter") createTournament();
			}}
			bind:value={tournamentName}
			label="Name"
			placeholder="Name"
		/>
		<br />
		<TextInput
			on:keyup={(e) => {
				if (e.key === "Enter") createTournament();
			}}
			bind:value={tournamentDate}
			label="Date"
			placeholder="Date"
		/>
		<br />
		<Button
			kind="primary"
			class="button"
			size="small"
			on:click={createTournament}
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
		>
			<p
				style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
			>
				Create New Tournament
			</p>
		</Button>
	</Form>
</div>
<div style="padding: 10px;" class="grid">
	{#each tournaments as tournament}
		<div class="box">
			<h3>
				<strong>{tournament.id}: {tournament.tournament_name}</strong>
			</h3>
			<h3 style="margin-bottom: 10px;">
				{tournament.tournament_date ?? "None"}
			</h3>
			<!--<div class="miniGrid">
				{#each tournament.tests as test, i}
					<div class="miniBox">
						<h5>Test {i}</h5>
						<p><strong>Name:</strong> {test.test_name}</p>
						<p><strong>Description:</strong> {test.test_description}</p>
					</div>
				{/each}
			</div>-->
		</div>
	{/each}
</div>

<style>
	h3 {
		font-size: 20px;
		margin: 0;
		padding: 0;
	}
	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 10px 20px;
	}

	.grid {
		display: grid;
		grid-template-columns: 50% 50%;
	}

	:global(.tournamentForm) {
		min-width: 400px;
	}

	/*.miniGrid {
		display: grid;
		grid-template-columns: 100%;
		grid-gap: 5px;
	}
	.miniBox {
		background-color: var(--tinted-green);
	}*/
</style>
