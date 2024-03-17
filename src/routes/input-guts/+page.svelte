<script lang="ts">
	import { onMount } from "svelte";
	import { fillInTeams, getTeams } from "$lib/supabase/guts.ts";
	import { clear } from "$lib/supabase/guts.ts";
	import { submit } from "$lib/supabase/guts.ts";
	import { getAnswerData } from "$lib/supabase/guts.ts";
	import { num_rounds } from "$lib/supabase/guts.ts";
	import { questions_per_round } from "$lib/supabase/guts.ts";

	let test = "MMT 2024";
	let round = "Team Round";
	let curr_team = "...";
	let answer_data = {};
	let teams = [];
	console.log("Defining the onMount now.")

	answer_data["..."] = {};
	for (let i = 1; i < num_rounds + 1; i++) {
		answer_data["..."][i] = {};
		for (let j = 1; j < questions_per_round + 1; j++) {
			answer_data["..."][i][j] = { value: "", correct: false };
		}
	}
	answer_data["..."]["score"] = 0;
	answer_data["..."]["rounds_complete"] = new Set([0]);

	onMount(async () => {
		console.log("HEEEE");
		teams = await getTeams();
		await fillInTeams();
		answer_data = await getAnswerData();
		console.log(answer_data);
		console.log(answer_data["Arpit"][1][1])
		console.log(teams);
	});

	async function selected(event) {
		answer_data = await getAnswerData();
		curr_team = event.target.value;		
		console.log(curr_team)
		console.log({curr_team});
		console.log(answer_data[curr_team]);
	}

</script>

<div>
	<h1>Grade {test}</h1>
	<p>Round: {round}</p>
	<select id="teamSelect" on:change={selected}>
		<option value="" disabled selected>Select the Team:</option>
		{#each teams as team}
			<option value={team.replace(/\s+/g, '-')}>{team}</option>
		{/each}
	</select>

	<div id='all_info'>
	{#each Array(num_rounds) as _, round}
		<div class='block'>
		<h3>Round {round + 1}</h3>
		{#each Array(questions_per_round) as __, question}
			<div class="set">
			Response:
			<input type="text" placeholder={`Answer ${round + 1}.${question + 1}`} bind:value={answer_data[curr_team][round + 1][question + 1]["value"]}> &nbsp;&nbsp;&nbsp;&nbsp;
			Correct:
			<input type="checkbox" bind:checked={answer_data[curr_team][round + 1][question + 1]["correct"]}>
			</div>
		{/each}
		<button on:click={() => submit(curr_team, round + 1)}>Submit</button>
		<button on:click={() => clear(curr_team, round + 1)}>Clear Data</button>
		</div>
		<br>
	{/each}
	</div>

</div>
