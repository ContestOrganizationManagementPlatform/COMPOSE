import { supabase } from "../supabaseClient";
import { getProblem } from "$lib/supabase/problems";

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
 * Get a test's testsolvers from the database
 *
 * @param test_id number
 * @param customSelect optional, string
 * @returns testsolvers list
 */
export async function getTestTestsolvers(
	test_id: number,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolvers")
		.select(customSelect)
		.eq("test_id", test_id);
	if (error) throw error;
	return data;
}

/**
 * Get a solver's id from the database
 *
 * @param solver_id number
 * @param customSelect optional, string
 * @returns testsolvers list
 */
export async function getSolverTestsolvers(
	solver_id: number,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolvers")
		.select(customSelect)
		.eq("solver_id", solver_id);
	if (error) throw error;
	return data;
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
 * Select specific testsolve from the database
 *
 * @param solver_id number
 * @param customSelect optional, string
 * @returns testsolves list
 */
export async function getSelectTestsolves(
	solver_id: number,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolves")
		.select(customSelect)
		.eq("solver_id", solver_id);
	if (error) throw error;
	return data;
}

/**
 * Select testsolve id from the database
 *
 * @param id number
 * @param customSelect optional, string
 * @returns testsolves list
 */
export async function getOneTestsolve(id: number, customSelect: string = "*") {
	let { data, error } = await supabase
		.from("testsolves")
		.select(customSelect)
		.eq("id", id);
	if (error) throw error;
	return data;
}

/**
 * Check if prior testsolve
 *
 * @param test_id number
 * @param solver_id number
 * @param completed boolean
 * @returns testsolves list
 */
export async function checkPriorTestsolve(
	test_id: number,
	solver_id: number,
	completed: boolean
) {
	let { data, error } = await supabase
		.from("testsolves")
		.select("*")
		.eq("test_id", test_id)
		.eq("solver_id", solver_id)
		.eq("completed", completed);
	if (error) throw error;
	return data;
}

/**
 * Update specific testsolve from the database
 *
 * @param testsolve_id number
 * @param testsolve_data any
 * @returns testsolve data
 */
export async function updateTestsolve(
	testsolve_id: number,
	testsolve_data: any
) {
	let { data, error } = await supabase
		.from("testsolves")
		.update(testsolve_data)
		.eq("id", testsolve_id);
	if (error) throw error;
	return data;
}

/**
 * Insert a testsolve into the database
 *
 * @param testsolve_data TestsolveRequest
 * @returns testsolve data
 */
export async function insertTestsolve(testsolve_data: TestsolveRequest) {
	let { data, error } = await supabase
		.from("testsolves")
		.insert([testsolve_data])
		.select();
	if (error) throw error;
	return data[0];
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
 * Get a problem's testsolve answers
 *
 * @param problemId number
 * @param customSelect optional, string
 * @returns list of testsolve answers
 */
export async function getProblemTestsolveAnswers(
	problemId: number,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolve_answers")
		.select(customSelect)
		.eq("problem_id", problemId);
	if (error) throw error;
	return data;
}

/**
 * Get a problem's testsolve answers in a specific order
 *
 * @param customOrder string
 * @param customSelect optional, string
 * @returns list of testsolve answers
 */
export async function getProblemTestsolveAnswersOrder(
	customOrder: string,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolve_answers")
		.select(customSelect)
		.order(customOrder);
	if (error) throw error;
	return data;
}

/**
 * Get testsolve answer from testsolve id
 *
 * @param testsolve_id number
 * @param customSelect optional, string
 * @returns list of testsolve answers
 */
export async function getTestsolveTestsolveAnswers(
	testsolve_id: number,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolve_answers")
		.select(customSelect)
		.eq("testsolve_id", testsolve_id);
	if (error) throw error;
	return data;
}

/**
 * Get all testsolve answers with an order
 *
 * @param customOrder string
 * @param customSelect optional, string
 * @returns list of testsolve answers
 */
export async function getAllTestsolveAnswersOrder(
	customOrder: string,
	customSelect: string = "*"
) {
	let { data, error } = await supabase
		.from("testsolve_answers")
		.select(customSelect)
		.order(customOrder);
	if (error) throw error;
	return data;
}

/**
 * Insert testsolve answers to a problem
 *
 * @param testsolve_answers any[]
 */
export async function addProblemTestsolveAnswer(testsolve_answers: any[]) {
	const { error: error } = await supabase
		.from("testsolve_answers")
		.insert(testsolve_answers);
	if (error) throw error;

	testsolve_answers.forEach(async (testsolve) => {
		const problem = await getProblem(testsolve.problem_id);
		await fetch("/api/discord-dm", {
			method: "POST",
			body: JSON.stringify({
				userId: problem.author_id,
				message: "Feedback added to your problem " + problem.id,
			}),
		});
	});
}

/**
 * Update a problem's testsolve answers
 *
 * @param feedbackId number
 * @param newFeedback any
 */
export async function updateTestsolveAnswer(
	feedbackId: number,
	newFeedback: any
) {
	let { error } = await supabase
		.from("testsolve_answers")
		.update(newFeedback)
		.eq("id", feedbackId);
	if (error) throw error;
}

/**
 * Delete a problem's testsolve answers
 *
 * @param testsolveId number
 */
export async function deleteTestsolveAnswer(feedbackId: number) {
	let { error } = await supabase
		.from("testsolve_answers")
		.delete()
		.eq("testsolve_id", feedbackId);
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

/**
 * Get specific testsolve feedback answers based on testsolve_id
 *
 * @param testsolve_id number
 * @returns testsolve feedback answers
 */
export async function getSelectTestsolveAnswers(testsolve_id: number) {
	let { data, error } = await supabase
		.from("testsolve_feedback_answers")
		.select("*")
		.eq("testsolve_id", testsolve_id);
	if (error) throw error;
	return data;
}

/**
 * Update testsolve feedback answer
 *
 * @param testsolve_id number
 * @param testsolve_data any
 */
export async function updateTestsolveFeedbackAnswers(
	testsolve_id: number,
	testsolve_data: any
) {
	let { error: error } = await supabase
		.from("testsolve_feedback_answers")
		.update(testsolve_data)
		.eq("id", testsolve_id);
	if (error) throw error;
}

/**
 * Insert testsolve feedback answers
 *
 * @param testsolve_data any[]
 */
export async function insertTestsolveFeedbackAnswers(testsolve_data: any[]) {
	let { error: error } = await supabase
		.from("testsolve_feedback_answers")
		.insert(testsolve_data);
	if (error) throw error;
}
