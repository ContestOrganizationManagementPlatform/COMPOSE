import { supabase } from "../supabaseClient";

export interface ProblemRequest {
	problem_latex?: string;
	answer_latex?: string;
	solution_latex?: string;
	comment_latex?: string;
	author_id?: string;
	difficulty?: number;
	nickname?: string;
	sub_topics?: string;
}

/**
 * Fetches problem based on id
 *
 * @param problem_id
 * @returns problem object
 */
export async function getProblem(problem_id: number) {
	let { data, error } = await supabase
		.from("problems")
		.select("*")
		.eq("id", problem_id)
		.single();
	if (error) throw error;
	return data;
}

/**
 * Returns all problems from the database.
 * It includes non-archived problems if normal is true, and it includes archived problems if archived is true
 *
 * @param normal boolean
 * @param archived boolean
 * @returns problem list
 */
export async function getAllProblems(
	normal: boolean = true,
	archived: boolean = false
) {
	if (normal && archived) {
		let { data, error } = await supabase.from("problems").select("*");
		if (error) throw error;
		return data;
	}
	if (normal && !archived) {
		let { data, error } = await supabase
			.from("problems")
			.select("*")
			.eq("archived", false);
		if (error) throw error;
		return data;
	}
	if (!normal && archived) {
		let { data, error } = await supabase
			.from("problems")
			.select("*")
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
 * @param problem_id  number
 * @returns problem data from database
 */
export async function editProblem(problem: ProblemRequest, problem_id: number) {
	const { data, error } = await supabase
		.from("problems")
		.update(problem)
		.eq("id", problem_id)
		.select();
	if (error) throw error;
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

/**
 * Given a problem id, this returns all tests in which this problem appears
 *
 * @param problem_id number
 * @returns list of tests
 */
export async function getRelevantTests(problem_id: number) {
	// TEST THIS PLEASE
	let { data, error } = await supabase
		.from("test_problems")
		.select("test_id,name:test_id(test_name)")
		.eq("problem_id", problem_id);
	if (error) throw error;
	return data.map((obj) => {
		return { test_id: obj.test_id, test_name: obj.name.test_name };
	});
}

/**
 * Does getRelevantTests for all problems, with a single query
 *
 * @returns object containing all relevant tests for all problems
 */
export async function getAllRelevantTests() {
	// TEST THIS TOO
	let { data, error } = await supabase
		.from("test_problems")
		.select("problem_id,test_id,name:test_id(test_name)");
	if (error) throw error;
	let ans = {};
	for (let i of data) {
		if (i in Object.keys(ans)) {
			ans[i].append({ test_id: i.test_id, test_name: i.name.test_name });
		} else {
			ans[i] = [{ test_id: i.test_id, test_name: i.name.test_name }];
		}
	}
	return ans;
}
