import { supabase } from "../supabaseClient";
// import { archiveProblem } from "./problems";

export async function fetchNewTakerResponses(
	grader_id: number,
	batch_size: number = 10,
	test_id: number | null = null,
): Promise<any[]> {
	const { data: gradesData, error: gradesError } = await supabase
		.from("grades")
		.select("scan_id, test_problem_id")
		.eq("grader_id", grader_id)
		.not('grade', 'is', null);
	if (gradesError) {
		throw gradesError;
	}

	const self_removal_query = `scan_id.not.in.(${gradesData.map(row=>row.scan_id).join(',')}), test_problem_id.not.in.(${gradesData.map(row=>row.test_problem_id).join(',')})`;
	let query = supabase
		.from("grade_tracking")
		.select("scan_id, test_id, test_problem_id")
		.lt("claimed_count", 2)
	if (test_id) {
		query = query.eq("test_id", test_id)
	}
	const { data: gradeTrackingData, error: gradeTrackingError } = await query.or(self_removal_query).limit(batch_size);
	if (gradeTrackingError) {
		throw gradeTrackingError;
	}

	if (gradeTrackingData.length < batch_size) {
		let wideQuery = supabase
			.from("grade_tracking")
			.select("scan_id, test_id, test_problem_id")
			.lt("graded_count", 2)
			.gte("claimed_count", 2)
		if (test_id) {
			wideQuery = wideQuery.eq("test_id", test_id);
		}
		const { data: wideGradeTrackingData, error: wideGradeTrackingError} = await query.or(self_removal_query).limit(batch_size - gradeTrackingData.length);
		if (wideGradeTrackingError) {
			throw wideGradeTrackingError;
		}
		gradeTrackingData.push(
			...wideGradeTrackingData
		);
	}

	// Process the trTrackingData as needed

	const takerResponses: any[] = [];
	const { error: newGradeError } = await supabase.from("grades").upsert(
		gradeTrackingData.map((item) => ({
			grader_id,
			scan_id: item.scan_id,
			test_problem_id: item.test_problem_id,
		})),
		{ onConflict: "grader_id, scan_id, test_problem_id" }
	);
	if (newGradeError) {
		throw newGradeError;
	}

	for (const item of gradeTrackingData) {
		const { data: scanData, error: scanError } = await supabase
			.from("scans")
			.select("scan_path")
			.eq("id", item.scan_id)
			.single();
		if (scanError) {
			throw scanError;
		}

		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("test_name")
			.eq("id", item.test_id)
			.single();
		if (testError) {
			throw testError;
		}

		const { data: testProblemData, error: testProblemError } = await supabase
			.from("test_problems")
			.select("problem_id, problem_index, top_left, bottom_right")
			.eq("relation_id", item.test_problem_id)
			.single();
		if (testProblemError) {
			throw testProblemError;
		}

		const { data: problemData, error: problemError } = await supabase
			.from("problems")
			.select("problem_latex, answer_latex, solution_latex")
			.eq("id", testProblemData.problem_id)
			.single();
		if (problemError) {
			throw problemError;
		}

		takerResponses.push({
			...item,
			...testData,
			...problemData,
			...testProblemData,
			image: await getImageUrl(scanData.scan_path),
		});
	}
	return takerResponses;
}

export async function submitGrade(grader_id: number, data: any): Promise<void> {
	const { error } = await supabase
		.from("grades")
		.update({ ...data, grader_id })
		.eq("scan_id", data.scan_id)
		.eq("test_problem_id", data.test_problem_id);
	if (error) {
		throw error;
	}
}

// TypeScript function to get the URL of an image stored in a Supabase bucket
async function getImageUrl(
	path: string,
	bucket: string = "scans"
): Promise<string | null> {
	const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
	return data?.publicUrl || null;
}
