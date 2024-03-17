import { supabase } from "../supabaseClient";
import * as fs from 'fs';

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

export async function fillInTeams() {
    let {data, error} = await supabase.storage.from("guts").download("guts_info.json");
    console.log("HELLO!")
    if (error) {
        throw error;
    }
    const json_data = await new Response(data).json();
    const {team_lookup: team_lookup_new, answer_data: answer_data_new} = json_data;
    team_lookup = team_lookup_new
    answer_data = answer_data_new

    if (Object.values(answer_data).length == 0) {
        answer_data["..."] = {};
        for (let i = 1; i < num_rounds + 1; i++) {
            answer_data["..."][i] = {};
            for (let j = 1; j < questions_per_round + 1; j++) {
                answer_data["..."][i][j] = { value: "", correct: false };
            }
        }
        answer_data["..."]["score"] = 0;
        answer_data["..."]["rounds_complete"] = new Set([0]);

        let teams = await getTeams();
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
    }
    modifyAndUploadJson();
}

async function modifyAndUploadJson(): Promise<void> {
    const updatedJsonData: any = { team_lookup, answer_data };
    const updatedJsonString = JSON.stringify(updatedJsonData, null, 2);
    fs.writeFileSync("tmp.json", updatedJsonString, { encoding: 'utf-8' });

    // Download the file
    const fileContent = fs.readFileSync("tmp.json");
    const { data, error } = await supabase.storage.from("guts").upload("guts_info.json", fileContent, {
      contentType: 'application/json',
    });
    if (error) { throw error; }
}

export async function getAnswerData() {
    return answer_data;
}

export async function getStatus() {
    let status: any[] = Object.values(team_lookup);
    console.log("HIIIIE")
    console.log(team_lookup)
    status.sort((a, b) => b.showing_score - a.showing_score);
    return status;
}

export function addResult(team_name, latest_round = 0, score = 0, showing_score = 0) {
	let newTeam = {
		team_name: team_name,
		curr_round: latest_round,
		score: score,
        showing_score: showing_score,
	};
	team_lookup[team_name] = newTeam;
    modifyAndUploadJson();
};

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

export function clear(curr_team, round) {
    if (curr_team in answer_data) {
        answer_data[curr_team]["rounds_complete"].delete(round);
        for(let j = 0; j < questions_per_round; j ++) { 
            answer_data[curr_team][round][j + 1] = {"value": "", "correct": false};
        }
        
        let arrayFromSet = [...answer_data[curr_team]["rounds_complete"]];
        let largestElement = Math.max.apply(null, arrayFromSet);
        let score = calculate_score(curr_team)
        answer_data[curr_team]["score"] = score;

        addResult(curr_team, largestElement, score, 10);
        console.log(answer_data[curr_team]);
    }
}

export function submit(curr_team, round) {
    if (curr_team in answer_data) {
        answer_data[curr_team]["rounds_complete"].add(round);
        let arrayFromSet = [...answer_data[curr_team]["rounds_complete"]];
        let largestElement = parseInt(Math.max.apply(null, arrayFromSet), 10);
        let score = calculate_score(curr_team)
        answer_data[curr_team]["score"] = score;
        addResult(curr_team, largestElement, score, 10);
        console.log(answer_data[curr_team]);
    }
}