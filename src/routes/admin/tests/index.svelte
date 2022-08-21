<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Menu from "$lib/components/Menu.svelte";
	import Button from "$lib/components/Button.svelte";
	import TestList from "$lib/components/TestList.svelte";
	let tournaments = {};
	let tests = [];
	let loading = true;

	async function getTests() {
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*,tournaments(tournament_name)");
		if (error) alert(error.message);
		for (let test of testList) {
			tournaments[test.tournament_id].push(test);
			tests.push(test);
			console.log(tests);
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

<br />
<h1>Admin: View Tests</h1>
<br />
<h3>For editing test coordinators</h3>
{#if loading}
	Loading up tests...
{:else}
	<div style="padding: 10px; margin-left: auto; margin-right: auto;">

		<TestList {tests} />
	</div>
{/if}

<style>
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

	.miniGrid {
		display: grid;
		grid-template-columns: 100%;
		grid-gap: 5px;
	}
	.miniBox {
		border: 2px solid var(--green);
	}
</style>
