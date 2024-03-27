<script lang="ts">
	let test = "MMT 2024";
	let round = "Team Round";
	let curr_team = "...";
	let points = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let answer_data = {};
	import {teams} from "$lib/export.js";
	import {addResult} from "$lib/export.js";
	import {showResult} from "$lib/export.js";
	import {num_rounds} from "$lib/export.js";
	import {max_round_display} from "$lib/export.js";
	import {questions_per_round} from "$lib/export.js";
	
	answer_data["..."] = {};
	for (let i = 1; i < num_rounds + 1; i++) {
		answer_data["..."][i] = {};
		for (let j = 1; j < questions_per_round + 1; j++) {
			answer_data["..."][i][j] = { value: "", correct: false };
		}
		console.log({answer_data});
		answer_data["..."]["score"] = 0;
		answer_data["..."]["rounds_complete"] = new Set([0]);
	}
	for (let team of teams) {
		answer_data[team] = {};
		for (let i = 1; i < num_rounds + 1; i++) {
			answer_data[team][i] = {};
			for (let j = 1; j < questions_per_round + 1; j++) {
				answer_data[team][i][j] = { value: "", correct: false };
			}
		}
		answer_data[team]["score"] = 0;
		answer_data[team]["rounds_complete"] = new Set([0]);
	}
	answer_data = { ...answer_data };

	function selected(event) {
		curr_team = event.target.value;		
		console.log({curr_team});
		console.log(answer_data[curr_team]);
	}

	function calculate_score(team) {
		let score = 0;
		for(let i = 0; i < num_rounds; i ++) {
			for(let j = 0; j < questions_per_round; j ++) { 
				if (answer_data[team][i + 1][j + 1]["correct"]) {
					score += points[i];
				}
			}
		}
		return score;
	}

	function clear(round) {
		console.log("HHHH");
		if (curr_team in answer_data) {
			answer_data[curr_team]["rounds_complete"].delete(round);
			for(let j = 0; j < questions_per_round; j ++) { 
				answer_data[curr_team][round][j + 1] = {"value": "", "correct": false};
			}
			
			let arrayFromSet = [...answer_data[curr_team]["rounds_complete"]];
			let largestElement = Math.max.apply(null, arrayFromSet);
			let score = calculate_score(curr_team)
			answer_data[curr_team]["score"] = score;

			addResult(curr_team, largestElement, score);
			if (round <= max_round_display) {
				showResult(curr_team, largestElement, score);
			}
			console.log(answer_data[curr_team]);
		}
	}

	function submit(round) {
		if (curr_team in answer_data) {
			answer_data[curr_team]["rounds_complete"].add(round);
			let arrayFromSet = [...answer_data[curr_team]["rounds_complete"]];
			let largestElement = parseInt(Math.max.apply(null, arrayFromSet), 10);
			let score = calculate_score(curr_team)
			answer_data[curr_team]["score"] = score;
			addResult(curr_team, largestElement, score);
			if (round <= max_round_display) {
				showResult(curr_team, largestElement, score);
			}
			console.log(answer_data[curr_team]);
		}
	}

</script>

<div>
	<h1>Grade {test}</h1>
	<p>Round: {round}</p>
	<select id="teamSelect" on:change={selected}>
		<option value="" disabled selected>Select the Team:</option>
		{#each teams as team}
			<option value={team.toLowerCase().replace(/\s+/g, '-')}>{team}</option>
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
		<button on:click={() => submit(round + 1)}>Submit</button>
		<button on:click={() => clear(round + 1)}>Clear Data</button>
		</div>
		<br>
	{/each}
	</div>

</div>
