import { supabase } from "../supabaseClient";
import { archiveTest } from "./tests";

export interface TournamentRequest {
	tournament_name?: string;
	tournament_date?: string;
}

/**
 * Returns tournament info object given tournament id
 *
 * @param tournament_id number
 * @returns tournament info from database
 */
async function getTournamentInfo(tournament_id: number) {
	let { data, error } = await supabase
		.from("tournaments")
		.select("*")
		.eq("tournament_id", tournament_id)
		.single();
	if (error) throw error;
	return data;
}

/**
 * Returns test info objects associated with a tournament, given its tournament id
 *
 * @param tournament_id number
 * @returns list of test info objects
 */
async function getTournamentTests(tournament_id: number) {
	let { data, error } = await supabase
		.from("tests")
		.select("*")
		.eq("tournament_id", tournament_id);
	if (error) throw error;
	return data;
}

/**
 * Returns everything about a tournament given its id: info and tests
 *
 * @param tournament_id number
 * @returns tournament object
 */
async function getTournament(tournament_id: number) {
	let tournament = await getTournamentInfo(tournament_id);
	tournament.tests = await getTournamentTests(tournament_id);
	return tournament;
}

async function archiveTournament(tournament_id: number) {
	const { error } = await supabase
		.from("tests")
		.update({ archived: true })
		.eq("tournament_id", tournament_id);
	let tests = await getTournamentTests(tournament_id);
	for (let i of tests) {
		archiveTest(i.id);
	}
}
