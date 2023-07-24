<script>
	import { TextInput } from "carbon-components-svelte";
	import { supabase } from "$lib/supabaseClient";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";

	let tournaments = [];
	let tournamentsArchive = [];
	let tournamentName = "";
	let tournamentDate = "";

	async function getTournaments() {
		try {
			let { data: tournamentList, error } = await supabase
				.from("tournaments")
				.select("*");
			if (error) throw error;
			tournaments = tournamentList.filter((tournament) => {
				return !tournament.archived;
			});
			tournamentsArchive = tournamentList.filter((tournament) => {
				return tournament.archived;
			});
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function createTournament() {
		try {
			const { data, error } = await supabase
				.from("tournaments")
				.insert([
					{ tournament_name: tournamentName, tournament_date: tournamentDate },
				]);
			if (error) throw error;
			getTournaments();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getTournaments();
</script>

<br />
<h1>Admin: View Tournaments</h1>
<br />

<div class="flex profileButtons">
	<form on:submit|preventDefault class="tournamentForm">
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
		<Button action={createTournament} title="Create New Tournament" />
	</form>
</div>
<div style="padding: 10px;" class="grid">
	{#each tournaments as tournament}
		<a href={"/admin/tournaments/" + tournament.id}>
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
		</a>
	{/each}
</div>
<br />
<h2>Archived Tournaments</h2>
<div style="padding: 10px;" class="grid">
	{#each tournamentsArchive as tournament}
		<a href={"/admin/tournaments/" + tournament.id}>
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
		</a>
	{/each}
</div>

<style>
	h3 {
		font-size: 20px;
		margin: 0;
		padding: 0;
	}
	a {
		color: black;
		text-decoration: none;
	}
	a div {
		transition: 0.4s ease-in-out;
	}
	a:hover div {
		background-color: var(--primary-tint);
	}
	.box {
		background-color: var(--text-color-light);
		border: 1px solid var(--primary);
		margin: 10px;
		padding: 10px 20px;
	}

	.grid {
		display: grid;
		grid-template-columns: 50% 50%;
	}
</style>
