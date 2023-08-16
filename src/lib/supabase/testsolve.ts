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
