<script>
	import toast from "svelte-french-toast";
	import Button from "$lib/components/Button.svelte";
	import TestList from "$lib/components/TestList.svelte";
	import { handleError } from "$lib/handleError.ts";
	import { getAllTests, getAllTournaments } from "$lib/supabase";

	let tournaments = {};
	let tests = [];
	let testsArchived = [];
	let loading = true;

	async function getTests() {
		try {
			let testList = await getAllTests("*,tournaments(tournament_name)");
			for (let test of testList) {
				tournaments[test.tournament_id].push(test);

				if (test.archived) testsArchived.push(test);
				else tests.push(test);
			}
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getTournaments() {
		try {
			let tournamentList = await getAllTournaments();
			for (let tournament of tournamentList) {
				tournaments[tournament.id] = [tournament.tournament_name];
			}
			getTests();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
	<br />
	<h2>Archived Tests</h2>
	<div style="padding: 10px; margin-left: auto; margin-right: auto;">
		<TestList tests={testsArchived} />
	</div>
{/if}
