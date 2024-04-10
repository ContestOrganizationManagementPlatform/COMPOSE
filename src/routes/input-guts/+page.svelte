<script lang="ts">
	import { onMount } from "svelte";
	import { getTeams } from "$lib/supabase/guts.ts";
	import { clear } from "$lib/supabase/guts.ts";
	import { submit } from "$lib/supabase/guts.ts";
	import { getAnswerData } from "$lib/supabase/guts.ts";
	import { num_rounds } from "$lib/supabase/guts.ts";
	import { questions_per_round } from "$lib/supabase/guts.ts";
	import toast from "svelte-french-toast";

	let test = "SMT 2024";
	let round = "Team Round";
	let curr_team = "...";
	let answer_data = {};
	let curr_team_answer_data = {};
	let teams = [];

	answer_data["..."] = {};
	for (let i = 1; i < num_rounds + 1; i++) {
		answer_data["..."][i] = {};
		for (let j = 1; j < questions_per_round + 1; j++) {
			answer_data["..."][i][j] = { value: "", correct: false };
		}
		answer_data["..."][i]["complete"] = false;
	}
	answer_data["..."]["score"] = 0;
	curr_team_answer_data = answer_data["..."];
	// curr_team_answer_data = JSON.parse(JSON.stringify(answer_data["..."]));

	onMount(async () => {
		teams = await getTeams();
		// await fillInTeams();
		answer_data = await getAnswerData();
	});

	async function selected(event) {
		let different = false;
		let answer_data = await getAnswerData();
		if (curr_team != "...") {
			for(let i = 1; i < num_rounds+1; i ++) {
				for(let j = 1; j < questions_per_round+1; j ++) {
					if (answer_data[curr_team][i][j]["correct"] != curr_team_answer_data[i][j]["correct"]) {
						different = true
					}
					if (answer_data[curr_team][i][j]["value"] != curr_team_answer_data[i][j]["value"]) {
						different = true
					}
				}
			}
		}
		if (different) {
			if (!confirm(`Your have unsaved changes! Are you sure you want to switch to a different team?`)) {
				// event.target.value = curr_team.replace(/ /g, '-');
				event.target.value = curr_team
        		return; // Exit if user cancels
			}
    	}
		try {
			answer_data = await getAnswerData();
			curr_team = event.target.value;	
	
			// curr_team = curr_team.replace(/-/g, ' ');	
			// curr_team_answer_data = JSON.parse(JSON.stringify(answer_data[curr_team]));
			curr_team_answer_data = answer_data[curr_team];
			toast.success(`Now grading Team ${curr_team}`, {
				duration: 2000,
			});
		} catch{
			console.log("Issue!")
		}
	
	}

	async function clear_helper(curr_team, round) {
		if (!confirm(`Are you sure you want to clear all of ${curr_team}'s answers for round ${round}?`)) {
        	return; // Exit if user cancels
    	}
		try {
			// answer_data[curr_team][round] = curr_team_answer_data[round];
			await clear(curr_team, round);
			answer_data = await getAnswerData();
			curr_team_answer_data = answer_data[curr_team];
			// answer_data = {...answer_data}
			// curr_team_answer_data = {...curr_team_answer_data}
			toast.success('Clear successful!', {
				duration: 3000,
			});
		} catch (error) {
			toast.error('Clear failed!', {
				duration: 3000,
			});
		}
	}


	async function submit_helper(curr_team, round) {
		if (curr_team != "...") {
			try {
				// answer_data[curr_team][round] = curr_team_answer_data[round];
				await submit(curr_team, round, curr_team_answer_data[round]);
				answer_data = await getAnswerData();
				curr_team_answer_data = answer_data[curr_team];
				toast.success('Submission successful!', {
					duration: 3000,
				});
			} catch (error) {
				toast.error('Submission failed!', {
					duration: 3000,
				});
			}
		}
	}

	async function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}

	// async function submit_all(curr_team) {
	// 	for(let i = 1; i < num_rounds+1; i ++) {
	// 		let no_changes = true;
	// 		if (curr_team != "...") {
	// 			for(let j = 1; j < questions_per_round+1; j ++) {
	// 				if (curr_team_answer_data[i][j]["correct"] != false) {
	// 					no_changes = false
	// 				}
	// 				if (curr_team_answer_data[i][j]["value"] != "") {
	// 					console.log(i)
	// 					no_changes = false
	// 				}
	// 			}
	// 		}
	// 		if (!no_changes) {
	// 			await submit_helper(curr_team, i);
	// 		}
	// 		await sleep(100);
    // 	}
	// 	answer_data[curr_team] = curr_team_answer_data;
	// }

</script>

<div>
	<h1>Grade {test}</h1>
	<p>Round: {round}</p>
	<select id="teamSelect" on:change={selected}>
		<option value="" disabled selected>Select the Team:</option>
		{#each teams as team}
			<option>{team}</option>
		{/each}
	</select>
	<h2>Grading Team {curr_team}</h2>

	<div id='all_info'>
			<!-- <br><button on:click={() => submit_all(curr_team)}>Submit All</button><br> -->
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
