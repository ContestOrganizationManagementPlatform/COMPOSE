<script lang="ts">
	import { onMount } from "svelte";
	import { fillInTeams, getTeams } from "$lib/supabase/guts.ts";
	import { clear } from "$lib/supabase/guts.ts";
	import { submit } from "$lib/supabase/guts.ts";
	import { getAnswerData } from "$lib/supabase/guts.ts";
	import { num_rounds } from "$lib/supabase/guts.ts";
	import { questions_per_round } from "$lib/supabase/guts.ts";

	let test = "SMT 2024";
	let round = "Team Round";
	let curr_team = "...";
	let answer_data = {};
	let curr_team_answer_data = {};
	let teams = [];
	console.log("Defining the onMount now.")

	answer_data["..."] = {};
	for (let i = 1; i < num_rounds + 1; i++) {
		answer_data["..."][i] = {};
		for (let j = 1; j < questions_per_round + 1; j++) {
			answer_data["..."][i][j] = { value: "", correct: false };
		}
		answer_data["..."][i]["complete"] = false;
	}
	answer_data["..."]["score"] = 0;
	curr_team_answer_data = JSON.parse(JSON.stringify(answer_data["..."]));

	onMount(async () => {
		console.log("HEEEE");
		teams = await getTeams();
		await fillInTeams();
		answer_data = await getAnswerData();
		console.log(answer_data);
		console.log(teams);
	});

	async function selected(event) {
		answer_data = await getAnswerData();
		curr_team = event.target.value;	
		curr_team = curr_team.replace(/-/g, ' ');	
		curr_team_answer_data = JSON.parse(JSON.stringify(answer_data[curr_team]));
	}

	async function clear_helper(curr_team, round) {
		answer_data[curr_team][round] = curr_team_answer_data[round];
		await clear(curr_team, round);
		answer_data = {...answer_data}
		curr_team_answer_data = {...curr_team_answer_data}
	}

	async function submit_helper(curr_team, round) {
		if (curr_team != "...") {
			answer_data[curr_team][round] = curr_team_answer_data[round];
			await submit(curr_team, round);
		}
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
			<input type="text" placeholder={`Answer ${round + 1}.${question + 1}`} bind:value={curr_team_answer_data[round + 1][question + 1]["value"]}> &nbsp;&nbsp;&nbsp;&nbsp;
			Correct:
			<input type="checkbox" bind:checked={curr_team_answer_data[round + 1][question + 1]["correct"]}>
			</div>
		{/each}
		<button on:click={() => submit_helper(curr_team, round + 1)}>Submit</button>
		<button on:click={() => clear_helper(curr_team, round + 1)}>Clear Data</button>
		</div>
		<br>
	{/each}
	</div>

</div>
