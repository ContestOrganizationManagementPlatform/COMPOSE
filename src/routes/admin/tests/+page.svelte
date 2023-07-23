<script>
	import { supabase } from "$lib/supabaseClient.ts";
	import toast from "svelte-french-toast";
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
		if (error) {
			toast.error(error.message);
		}
		for (let test of testList) {
			tournaments[test.tournament_id].push(test);
			tests.push(test);
		}
		loading = false;
	}

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			toast.error(error.message);
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
<p><i>For editing test coordinators</i></p>
<br />

{#if loading}
	Loading up tests...
{:else}
	<Button href="/admin/tests/new" title="Create New Test" />
	<div style="padding: 10px; margin-left: auto; margin-right: auto;">
		<TestList {tests} />
	</div>
{/if}
