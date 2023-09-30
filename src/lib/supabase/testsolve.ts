import { supabase } from "../supabaseClient";

export interface TestsolverRequest {
	test_id: number;
	solver_id: number;
}

export interface TestsolveAnswerRequest {
	testsolve_id: number;
	problem_id: number;
	answer: string;
	feedback?: string;
	correct: boolean;
}

export interface TestsolveFeedbackAnswerRequest {
	testsolve_id: number;
	feedback_question: number;
	answer: string;
}

export interface TestsolveRequest {
	test_id: number;
	solver_id: number;
	start_time?: string;
	end_time?: string;
	feedback?: string;
	completed: boolean;
	time_elapsed?: string;
	test_version: string;
	answers: TestsolveAnswerRequest[];
	feedback_answers: TestsolveFeedbackAnswerRequest[];
}

/**
 * Get all testsolvers from the database
 *
 * @param customSelect optional, string
 * @returns testsolvers list
 */
export async function getAllTestsolvers(customSelect: string = "*") {
	let { data: testsolveInfo, error } = await supabase
		.from("testsolvers")
		.select(customSelect);
	if (error) throw error;
	return testsolveInfo;
}

/**
 * Get select testsolvers from the database
 *
 * @param test_id number
 * @param solver_id number
 * @param customSelect optional, string
 * @returns count
 */
export async function getSelectTestsolvers(
	test_id: number,
	solver_id: number,
	customSelect: string = "*"
) {
	let { data, error, count } = await supabase
		.from("testsolvers")
		.select(customSelect, { count: "exact", head: true })
		.eq("test_id", test_id)
		.eq("solver_id", solver_id);
	if (error) {
		throw error;
	}
	return count;
}

/**
 * Creates a new testsolver in database, allowing them to testsolve
 *
 * @param testsolver object
 * @returns object in database, including id
 */
export async function addTestsolver(testsolver: TestsolverRequest) {
	const { data, error } = await supabase
		.from("testsolvers")
		.insert([testsolver])
		.select();
	if (error) throw error;
	return data;
}

/**
 * Deletes a testsolver in database given their testsolver id (not user id). Returns nothing.
 *
 * @param testsolver_id number
 */
export async function removeTestsolver(testsolver_id: number) {
	const { error } = await supabase
		.from("testsolvers")
		.delete()
		.eq("id", testsolver_id);
	if (error) throw error;
}

/**
 * Get all testsolves from the database
 *
 * @param customSelect optional, string
 * @returns testsolves list
 */
export async function getAllTestsolves(customSelect: string = "*") {
	let { data: testsolveInfo, error } = await supabase
		.from("testsolves")
		.select(customSelect);
	if (error) throw error;
	return testsolveInfo;
}

/**
 * Delete a testsolve from the database. Returns nothing.
 *
 * @param testsolveId
 */
export async function deleteTestsolve(testsolveId: number) {
	const { data, error } = await supabase
		.from("testsolvers")
		.delete()
		.eq("id", testsolveId);
	if (error) throw error;
}

/**
 * Get testsolve feedback answers
 *
 * @param orderedFeedbackQuestions
 * @returns testsolve feedback answers
 */
export async function getTestsolveAnswers(orderedFeedbackQuestions: []) {
	let { data: testsolve_feedback_answers, error } = await supabase
		.from("testsolve_feedback_answers")
		.select("*")
		.in(
			"feedback_question",
			orderedFeedbackQuestions.map((el) => el.id)
		);
	if (error) throw error;
	return testsolve_feedback_answers;
}
