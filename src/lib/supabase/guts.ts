import { supabase } from "../supabaseClient";
import { styles } from "$lib/scheme.json";

export let num_rounds = 9;
export let max_round_display = 8;
export let questions_per_round = 3;

let team_lookup = {};
let points = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let answer_data = {};

export async function getTeams() {
    const { data, error } = await supabase.from("teams").select("name");
    if (error) {
        throw error;
    }
    const teams = data.map((item) => item.name);
    return teams;
}

async function downloadJSON() {
    try {
        const cacheBuster = new Date().getTime();
        const { data, error } = await supabase.storage.from("guts").download(`guts_info.json?ts=${cacheBuster}`);
        if (error) throw error;

        const text = await data.text();
        const json_data = JSON.parse(text);
        const { team_lookup: team_lookup_new, answer_data: answer_data_new } = json_data;
        team_lookup = team_lookup_new;
        team_lookup = {...team_lookup}
        answer_data = answer_data_new;
        answer_data = {...answer_data}
    } catch (error) {
        console.error("Failed to download or parse JSON:", error);
    }
}

export async function fillInTeams() {
    await downloadJSON();
    if (Object.values(answer_data).length == 0) {
        answer_data["..."] = {};
        for (let i = 1; i < num_rounds + 1; i++) {
            answer_data["..."][i] = {};
            for (let j = 1; j < questions_per_round + 1; j++) {
                answer_data["..."][i][j] = { value: "", correct: false };
            }
        }
        answer_data["..."]["score"] = 0;

        let teams = await getTeams();
        for (let team of teams) {
            await addResult(team)
            answer_data[team] = {};
			for (let i = 1; i < num_rounds + 1; i++) {
				answer_data[team][i] = {};
				for (let j = 1; j < questions_per_round + 1; j++) {
					answer_data[team][i][j] = { value: "", correct: false };
				}
			}
			answer_data[team]["score"] = 0;
        }
    }
    modifyAndUploadJson();
}

async function modifyAndUploadJson(): Promise<void> {
    const updatedJsonData: any = { team_lookup, answer_data };
    const updatedJsonString = JSON.stringify(updatedJsonData, null, 2);
    
    const blob = new Blob([updatedJsonString], { type: 'application/json' });

    // Download the file
    const { data, error } = await supabase.storage.from("guts").upload("guts_info.json", blob, {
        contentType: 'application/json',
        upsert: true,
    });

    if (error) throw error;
}

export async function getAnswerData() {
    return answer_data;
}


export async function getStatus() {
    await downloadJSON();
    console.log(team_lookup)
    let status: any[] = Object.values(team_lookup);
    status = status.filter(a => a.team_name != `...`)
    status.sort((a, b) => b.showing_score - a.showing_score);
    return status;
}

export async function addResult(team_name, round = 0, score = 0, showing_score = 0, add = false) {
	let newTeam = {
		team_name: team_name,
		score: score,
        showing_score: showing_score,
	};
    if (round == 0) {
        for(let j = 0; j < num_rounds; j ++) {
            newTeam[j + 1] = styles["background-dark"];
        }
    }
    else {
        for(let j = 0; j < num_rounds; j ++) {
            newTeam[j + 1] = team_lookup[team_name][j+1];
        }
        if (add) {
            newTeam[round] = styles["secondary"];
        } else {
            newTeam[round] = styles["background-dark"];
        }
    }
	team_lookup[team_name] = newTeam;
    await modifyAndUploadJson();
};

function calculate_score(team, max_round) {
    let score = 0;
    for(let i = 0; i < max_round; i ++) {
        for(let j = 0; j < questions_per_round; j ++) { 
            if (answer_data[team][i + 1][j + 1]["correct"]) {
                score += points[i];
            }
        }
    }
    return score;
}

export function clear(curr_team, round) {
    if (curr_team in answer_data) {
        for(let j = 0; j < questions_per_round; j ++) { 
            answer_data[curr_team][round][j + 1] = {"value": "", "correct": false};
        }
        let score = calculate_score(curr_team, num_rounds)
        let show_score = calculate_score(curr_team, max_round_display)
        addResult(curr_team, round, score, show_score, false);
    }
}

export function submit(curr_team, round) {
    if (curr_team in answer_data) {
        let score = calculate_score(curr_team, num_rounds)
        let show_score = calculate_score(curr_team, max_round_display)
        addResult(curr_team, round, score, show_score, true);
    }
}