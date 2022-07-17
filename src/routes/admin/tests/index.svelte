<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Menu from "$lib/components/Menu.svelte";

	let tournaments = {};
	let loading = true;

	async function getTests() {
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*,tournaments(tournament_name)");
		if (error) alert(error.message);
		for (let test of testList) {
			tournaments[test.tournament_id].push(test);
		}
		loading = false;
	}

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			alert(error);
		}
		for (let tournament of tournamentList) {
			tournaments[tournament.id] = [tournament.tournament_name];
		}
		getTests();
	}

	getTournaments();
</script>

{#if loading}
	Loading up tests...
{:else}
	{#each Object.values(tournaments) as tournament}
		<div>
			<h3>{tournament[0]}</h3>
			{#each tournament.slice(1) as test}
				<div>
					<p>Name: {test.test_name}</p>
					<p>Description: {test.test_description}</p>
				</div>
				<br />
			{/each}
		</div>
	{/each}
{/if}
