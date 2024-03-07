import { supabase } from "../supabaseClient";
import { archiveProblem } from "./problems";

export async function fetchNewTakerResponses(
	grader_id: number,
	batch_size: number = 10,
	custom_select: string = "*"
): Promise<any[]> {
	console.log(`fetchNewTakerResponses called!!`);
	const { data: gradingCountData, error: gradingCountError } = await supabase
		.from("response_grading_count")
		.select(custom_select)
		.lt("grading_count", 2)
		.limit(batch_size);
	if (gradingCountError) {
		throw gradingCountError;
	}
	console.log(`Got grading DAta!!!`);
	return gradingCountData;

	// TODO: Currently it is just returning scan_id and problem_index
	// It would be preferable if it then finds the test_id and the answer_latex of the problem along with the scan_id
}
