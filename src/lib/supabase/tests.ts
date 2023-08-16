import { supabase } from "../supabaseClient";
import { archiveProblem } from "./problems";

export interface TestRequest {
	test_name: string;
	test_description?: string;
	tournament_id: number;
}

export interface TestEditRequest {
	test_name?: string;
	test_description?: string;
	test_version?: string;
	tournament_id?: number;
}

export interface TestFeedbackQuestionRequest {
	test_id: number;
	question: string;
}

/**
 * Returns test info from the database given a test id
 *
 * @param test_id number
 * @returns test object
 */
export async function getTestInfo(test_id: number) {
	let { data, error } = await supabase
		.from("tests")
		.select("*")
		.eq("id", test_id)
		.single();
	if (error) throw error;
	return data;
}

/**
 * Gets test coordinator list given a test id
 *
 * @param test_id number
 * @returns list of test coordinator IDs
 */
export async function getTestCoordinators(test_id: number) {
	let { data, error } = await supabase
		.from("test_coordinators")
		.select("coordinator_id")
		.eq("test_id", test_id);
	if (error) throw error;
	return data.map((obj) => {
		return obj.coordinator_id;
	});
}

/**
 * Fetches test problems given a test id
 * @param test_id number
 * @returns Test problem data (TODO: change format)
 */
export async function getTestProblems(test_id: number) {
	let { data, error } = await supabase
		.from("test_problems")
		.select("*")
		.eq("test_id", test_id);
	if (error) throw error;
	return data; // TODO: Change format to correspond with Conor's frontend code
}

/**
 * Returns everything about a test given an id: info, coordinators, problems
 *
 * @param test_id number
 * @returns Entire test object
 */
export async function getTest(test_id: number) {
	let test = await getTestInfo(test_id);
	test.coordinators = await getTestCoordinators(test_id);
	test.problems = await getTestProblems(test_id);
	return test;
}

/**
 * Creates a single test
 *
 * @param test object
 * @returns test data in database (including id)
 */
export async function createTest(test: TestRequest) {
	const { data, error } = await supabase.from("tests").insert([test]).select();
	if (error) throw error;
	return data[0];
}

/**
 * Bulk creates many tests
 *
 * @param tests
 * @returns list of test data in database (including id)
 */
export async function bulkTests(tests: TestRequest[]) {
	const { data, error } = await supabase.from("tests").insert(tests).select();
	if (error) throw error;
	return data;
}

/**
 * Edits a specific test's information from the database
 *
 * @param test object
 * @param test_id  number
 * @returns test data from database
 */
export async function editTestInfo(test: TestEditRequest, test_id: number) {
	const { data, error } = await supabase
		.from("tests")
		.update(test)
		.eq("id", test_id)
		.select();
	if (error) throw error;
	return data;
}

/**
 * Adds a test coordinator
 *
 * @param test_id
 * @param coordinator_id
 * @returns test coordinator data from database
 */
export async function addTestCoordinator(
	test_id: number,
	coordinator_id: number
) {
	const { data, error } = await supabase
		.from("test_coordinators")
		.insert([{ test_id, coordinator_id }])
		.select();
	if (error) throw error;
	return data;
}

/**
 * Removes a test coordinator. Returns nothing.
 *
 * @param test_id number
 * @param coordinator_id number
 */
export async function removeTestCoordinator(
	test_id: number,
	coordinator_id: number
) {
	const { error } = await supabase
		.from("test_coordinators")
		.delete()
		.eq("test_id", test_id)
		.eq("coordinator_id", coordinator_id);
	if (error) throw error;
}

/**
 * Archives a test. Returns nothing.
 *
 * @param test_id number
 */
export async function archiveTest(test_id: number) {
	const { error: error1 } = await supabase
		.from("tests")
		.update({ archived: true })
		.eq("id", test_id);
	if (error1) throw error1;

	let { data, error: error2 } = await supabase
		.from("test_problems")
		.select("problem_id")
		.eq("test_id", test_id);
	if (error2) throw error2;
	for (let i of data) {
		archiveProblem(i.problem_id);
	}
}

/**
 * Creates a test feedback question given its data
 *
 * @param question object
 * @returns object in database, including id
 */
export async function addTestFeedbackQuestion(
	question: TestFeedbackQuestionRequest
) {
	const { data, error } = await supabase
		.from("test_feedback_questions")
		.insert([question])
		.select();
	if (error) throw error;
	return data;
}

/**
 * Removes a test feedback question given its id. Returns nothing.
 *
 * @param question_id number
 */
export async function removeTestFeedbackQuestion(question_id: number) {
	const { error } = await supabase
		.from("test_feedback_questions")
		.delete()
		.eq("id", question_id);
	if (error) throw error;
}
