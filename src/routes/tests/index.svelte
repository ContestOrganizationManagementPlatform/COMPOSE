<script>
	import { supabase } from "$lib/supabaseClient.js";

	let tests = [];

	let tournaments = {};

	async function getTests() {
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*,tournaments(tournament_name)");
		if (error) alert(error.message);

		for (const test in testList) {
			if (!tournaments[test.tournament_id]) {
				tournaments[test.tournament_id] = {
					name: test.tournaments.tournament_name,
					tests: [],
				};
			}
			tournaments[test.tournament_id].tests.push(test);
		}
	}

	getTests();
</script>

{#each Object.values(tournaments) as tournament}
	<div>
		<h3>{tournament.name}</h3>
		{#each tournaments.tests as test}
			<div>
				<p>Name: {test.test_name}</p>
				<p>Description: {test.test_description}</p>
			</div>
		{/each}
	</div>
{/each}
