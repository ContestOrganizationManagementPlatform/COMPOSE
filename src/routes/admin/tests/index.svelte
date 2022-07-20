<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Menu from "$lib/components/Menu.svelte";
	import Button from "$lib/components/Button.svelte";

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

<br />
<h1>Admin: View Tests</h1>
<br />
{#if loading}
	Loading up tests...
{:else}
	<div style="padding: 10px;" class="grid">
		{#each Object.values(tournaments) as tournament}
			{#if tournament.length > 1}
				<div class="box">
					<h3 style="margin-bottom: 10px;"><strong>{tournament[0]}</strong></h3>
					<div class="miniGrid">
						{#each tournament.slice(1) as test, i}
							<div class="miniBox">
								<h5>Test {i + 1}</h5>
								<p><strong>Name:</strong> {test.test_name}</p>
								<p><strong>Description:</strong> {test.test_description}</p>
								<div style="margin: 5px;">
									<Button href={"/admin/tests/" + test.id} title="Edit" />
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div />
			{/if}
		{/each}
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
