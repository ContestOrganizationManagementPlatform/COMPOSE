import { supabase } from "../supabaseClient";
import { getAuthorName } from "./users";

export interface ProblemRequest {
	problem_latex: string;
	answer_latex: string;
	solution_latex: string;
	comment_latex?: string;
	author_id: string;
	difficulty?: number;
	nickname?: string;
	sub_topics?: string;
	image_name?: string;
}

export interface ProblemEditRequest {
	problem_latex?: string;
	answer_latex?: string;
	solution_latex?: string;
	comment_latex?: string;
	author_id?: string;
	difficulty?: number;
	nickname?: string;
	sub_topics?: string;
	image_name?: string;
}

/**
 * Fetches problem based on id
 *
 * @param problem_id
 * @returns problem object
 */
export async function getProblem(problem_id: number) {
	let { data, error } = await supabase
		.from("full_problems")
		.select("*")
		.eq("id", problem_id)
		.single();
	if (error) throw error;
	return data;
}

/**
 * Get front id of problem from id
 *
 * @param problem_id
 * @returns front_id string
 */
async function getFrontID(problem_id: number) {
	let { data, error } = await supabase
		.from("front_ids")
		.select("front_id")
		.eq("problem_id", problem_id)
		.single();

	if (error) throw error;
	return data.front_id;
}

/**
 * Returns all problems from the database.
 * It includes non-archived problems if normal is true, and it includes archived problems if archived is true
 *
 * @param columns string
 * @param normal boolean
 * @param archived boolean
 * @returns problem list
 */
export async function getAllProblems(
	columns: string = "*",
	normal: boolean = true,
	archived: boolean = false
) {
	if (normal && archived) {
		let { data, error } = await supabase.from("full_problems").select(columns);
		if (error) throw error;
		return data;
	}
	if (normal && !archived) {
		let { data, error } = await supabase
			.from("full_problems")
			.select(columns)
			.eq("archived", false);
		if (error) throw error;
		return data;
	}
	if (!normal && archived) {
		let { data, error } = await supabase
			.from("full_problems")
			.select(columns)
			.eq("archived", true);
		if (error) throw error;
		return data;
	}
	if (!normal && !archived) {
		return [];
	}
}

/**
 * Creates a single problem
 *
 * @param problem object
 * @returns problem data in database (including id)
 */
export async function createProblem(problem: ProblemRequest) {
	const { data, error } = await supabase
		.from("problems")
		.insert([problem])
		.select();
	if (error) throw error;

	await fetch("/api/discord-create", {
		method: "POST",
		body: JSON.stringify({
			problem: problem,
			authorName: getAuthorName(problem.author_id),
			id: data[0]?.id,
			created_at: data[0].created_at,
			front_id: await getFrontID(data[0]?.id),
			image: problem.image_name,
		}),
	});

	return data[0];
}

/**
 * Bulk creates many problems
 *
 * @param problems
 * @returns list of problem data in database (including id)
 */
export async function bulkProblems(problems: ProblemRequest[]) {
	const { data, error } = await supabase
		.from("problems")
		.insert(problems)
		.select();
	if (error) throw error;
	return data;
}

/**
 * Edits a specific problem from the database
 *
 * @param problem object
 * @param problem_id number
 * @returns problem data from database
 */
export async function editProblem(
	problem: ProblemEditRequest,
	problem_id: number
) {
	const { data, error } = await supabase
		.from("problems")
		.update(problem)
		.eq("id", problem_id)
		.select();
	if (error) throw error;

	await fetch("/api/discord-update", {
		method: "POST",
		body: JSON.stringify({
			id: problem_id,
			update: "edited",
			updater: getAuthorName(problem.author_id),
		}),
	});

	return data;
}

/**
 * Archives a problem. Returns nothing.
 *
 * @param problem_id number
 */
export async function archiveProblem(problem_id: number) {
	const { error } = await supabase
		.from("problems")
		.update({ archived: true })
		.eq("id", problem_id);
	if (error) throw error;
}
