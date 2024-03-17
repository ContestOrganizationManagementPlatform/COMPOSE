import { supabase } from "../supabaseClient";

async function getImageUrl(
	path: string,
	bucket: string = "scans"
): Promise<string | null> {
	const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
	return data?.publicUrl || null;
}

export async function getTestTrackingData(grader_id: number): Promise<any[]> {
	const { data: testTrackingData, error: testTrackingError } = await supabase
		.from("test_tracking")
		.select("test_id, available_responses, total_responses, scan_count");
	if (testTrackingError) {
		throw testTrackingError;
	}
	return testTrackingData;
}

export async function fetchNewTakerResponses(
	grader_id: number,
	batch_size: number | null = null,
	test_id: number | null = null,
): Promise<any[]> {
	// TODO: Francis knows what to do
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
		const { data: wideGradeTrackingData, error: wideGradeTrackingError} = await wideQuery.or(self_removal_query).limit(batch_size - gradeTrackingData.length);
		if (wideGradeTrackingError) {
			throw wideGradeTrackingError;
		}
		gradeTrackingData.push(
			...wideGradeTrackingData
		);
	}
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

	// Process the trTrackingData as needed

	const takerResponses: any[] = [];

	for (const item of gradeTrackingData) {
		const { data: gradeData, error: gradeError } = await supabase
			.from("grades")
			.select("id")
			.eq("scan_id", item.scan_id)
			.eq("test_problem_id", item.test_problem_id)
			.eq("grader_id", grader_id)
			.single();
		if (gradeError) {
			throw gradeError;
		}

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
			.select("problem_id, problem_number, top_left, bottom_right")
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
			grade_id: gradeData.id,
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

export async function undoGrade(grade_id: number): Promise<void> {
	const { error: updateGradeError } = await supabase
		.from("grades")
		.update({ grade: null })
		.eq("id", grade_id);
	if (updateGradeError) {
		throw updateGradeError;
	}
}


