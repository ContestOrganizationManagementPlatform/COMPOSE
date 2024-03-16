<script lang="ts">
	let test = "MMT 2024";
	let round = "Guts Round: Score Display";
	let max_per_side = 10;
	let screen_width = screen.width;
	let curr_screen = 0
	let num_screens = 0
	let num_teams = 0
	import {teams} from "$lib/export.js";
	import {get_status} from "$lib/export.js";
	import {addTeamHelper} from "$lib/export.js";
	import {max_round_display} from "$lib/export.js";
	import {addResult} from "$lib/export.js";
	let status = get_status();
	document.documentElement.style.setProperty('--screen_height', screen.height*0.65 + 'px');	

	function addTeam(team_name) {
		num_teams += 1;
		num_screens = Math.ceil(num_teams/max_per_side);
	};

	for(let team of teams) { 
		addTeam(team);
	}

	function calculateIndices(extra) {
		let start = curr_screen * max_per_side + extra;
		let end = Math.min((curr_screen + 1) * max_per_side + extra, status.length);
		return { start, end };
	}

	function updateTable() {
		status = get_status()
		console.log(get_status())
		if (curr_screen + 1 >= num_screens) curr_screen = 0;
		else curr_screen += 2;
		console.log(curr_screen)
    };

	setInterval(function() {
    	updateTable();
	}, 2000);

</script>

<div>
	<h1>{test}</h1>
	<p>{round}</p>

	<br />
	{#if max_round_display > 0}
		<p style="font-style: italic;">Please note that all scores after round {max_round_display} will not be shown.</p>
	{/if}
	<table class="gutsDisplay" id="leftTable">
		<thead>
			<tr class="gutsTr">
				<th class="gutsInfo">Ranking</th>
				<th class="gutsInfo teamName">Team Name</th>
				<th class="gutsInfo progress">Progress</th>
				<th class="gutsInfo">Score</th>
			</tr>
		</thead>
		<tbody id = "leftbody">
		    {#each Array.from({ length: calculateIndices(0).end - calculateIndices(0).start }, (_, i) => i + calculateIndices(0).start) as i}
				<tr class="gutsTr">
					<td class="gutsInfo">{max_per_side * curr_screen + i % max_per_side + 1}</td>
					<td class="gutsResult teamName">{status[i].team_name}</td>
					<td class="gutsResult progress">{status[i].curr_round}</td>
					<td class="gutsResult">{status[i].score}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<table class="gutsDisplay" id="rightTable">
		<thead>
			<tr class="gutsTr">
				<th class="gutsInfo">Ranking</th>
				<th class="gutsInfo teamName">Team Name</th>
				<th class="gutsInfo progress">Progress</th>
				<th class="gutsInfo">Score</th>
			</tr>
		</thead>
		<tbody id = "rightbody">
		    {#each Array.from({ length: calculateIndices(max_per_side).end - calculateIndices(max_per_side).start }, (_, i) => i + (calculateIndices(max_per_side).start)) as i}
				<tr class="gutsTr">
					<td class="gutsInfo">{max_per_side * (curr_screen + 1) + i % max_per_side + 1}</td>
					<td class="gutsResult teamName">{status[i].team_name}</td>
					<td class="gutsResult progress">{status[i].curr_round}</td>
					<td class="gutsResult">{status[i].score}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>



<style>
    #leftTable {
        float: left;
		background-color: #aaccee;
		
    }

    #rightTable {
        float: right;
		background-color: #aabbcc;
    }

    .gutsDisplay {
		width: 50%;
        justify-content: center;
		border-collapse: collapse;
		padding: 10px;
		white-space: nowrap;
		height: var(--screen_height);
    }

    .progress {
        width: 600px;
    }

    .teamName {
        width: 1000px;
    }

    .gutsInfo {
		padding: 10px;
        border: 1px solid black;
        text-align: left;
		font-family: var(--font-family);
		font-size: 20px;
    }

	.gutsResult {
		padding: 10px;
        border: 1px solid black;
        text-align: left;
		font-family: var(--font-family);
		font-size: 20px;
    }

    .gutsTr {
        background-color: #f2f2f2;
    }

</style>
