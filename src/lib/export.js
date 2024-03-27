export const teams = ["natalie", "francis", "arpit", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

let team_lookup = {};
export let showing_status = [];
export let status = [];
export let num_rounds = 9;
export let max_round_display = 8;
export let questions_per_round = 3;

function sortTeams() {
	status.sort((a, b) => b.score - a.score);
};

export function addTeamHelper(team_name) {
	let newTeam = {
		team_name: team_name,
		curr_round: 0,
		score: 0,
	};
	status.push(newTeam);
	showing_status.push(newTeam);
	team_lookup[team_name] = newTeam;
	sortTeams();
};

for(let team of teams) { 
	addTeamHelper(team);
}

export function get_status() {
	return showing_status;
}

export function showResult(team_name, latest_round, score) {
	showing_status = showing_status.filter(item => item !== team_lookup[team_name]);
	let newTeam = {
		team_name: team_name,
		curr_round: latest_round,
		score: score,
	};
	team_lookup[team_name] = newTeam;
	showing_status.push(newTeam)
	sortTeams();
};

export function addResult(team_name, latest_round, score) {
	status = status.filter(item => item !== team_lookup[team_name]);
	let newTeam = {
		team_name: team_name,
		curr_round: latest_round,
		score: score,
	};
	team_lookup[team_name] = newTeam;
	status.push(newTeam)
	sortTeams();
};
