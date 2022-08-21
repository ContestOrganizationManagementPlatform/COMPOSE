<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Button from "$lib/components/Button.svelte";

	let tournamentId = $page.params.id;
	let tournament;
	let tests = [];
	let loading = false;

	async function getTournament() {
		loading = true;
		let { data: serverTournament, error } = await supabase
			.from("tournaments")
			.select("*")
			.eq("id", tournamentId)
			.single();
		if (error) {
			alert(error.message);
		}
		tournament = serverTournament;
		loading = false;
	}

	async function getTests() {
		loading = true;
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*")
			.eq("tournament_id", tournamentId);
		if (error) alert(error.message);
		tests = testList;
		loading = false;
	}

	getTournament();
	getTests();
</script>

{#if loading}
	<p>Loading tournaments...</p>
{:else}
	<br />
	<h1>{tournament?.tournament_name}</h1>
	{#if tests.length == 0}
		<p>This tournament has no tests.</p>
	{:else}
		{#each tests as test, i}
			<div class="miniBox">
				<h5>Test {i + 1}</h5>
				<p><strong>Name:</strong> {test.test_name}</p>
				<p><strong>Description:</strong> {test.test_description}</p>
				<div style="margin: 5px;">
					<Button href={"/admin/tests/" + test.id} title="Edit" />
				</div>
			</div>
		{/each}
	{/if}
{/if}
