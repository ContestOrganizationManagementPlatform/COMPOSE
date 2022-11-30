<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Button from "$lib/components/Button.svelte";
	import {
		DataTable,
		Link,
		InlineNotification,
	} from "carbon-components-svelte";

	let tests = [];
	let tournaments = {};

	let errorTrue = false;
	let errorMessage = "";

	async function getTests() {
		let { data: testList, error } = await supabase
			.from("tests")
			.select("*,tournaments(tournament_name)");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}

		for (const test of testList) {
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

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

<br />
<h1>View Tests</h1>
<br />
<div style="padding: 10px;" class="grid">
	{#each Object.values(tournaments) as tournament}
		<div class="box">
			<h3 style="margin-bottom: 10px;"><strong>{tournament.name}</strong></h3>
			<div class="miniGrid">
				{#each tournament.tests as test, i}
					<div class="miniBox">
						<h5>Test {i + 1}</h5>
						<p><strong>Name:</strong> {test.test_name}</p>
						<p><strong>Description:</strong> {test.test_description}</p>
						<div style="margin: 5px;">
							<Button href={"/tests/" + test.id} title="View" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

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
		border-bottom: 2px solid var(--green);
	}
</style>
