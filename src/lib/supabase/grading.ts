import { supabase } from "../supabaseClient";
// import { archiveProblem } from "./problems";

export async function fetchNewTakerResponses(
	grader_id: number,
	batch_size: number = 10
): Promise<any[]> {
	const { data: gradeTrackingData, error: gradeTrackingError } = await supabase
		.from("grade_tracking")
		.select("scan_id, test_problem_id")
		.lt("claimed_count", 2)
		.limit(batch_size);
	if (gradeTrackingError) {
		throw gradeTrackingError;
	}

	const { data: gradesData, error: gradesError } = await supabase
		.from("grades")
		.select("scan_id, test_problem_id, grade")
		.eq("grader_id", grader_id);
	if (gradesError) {
		throw gradesError;
	}

	const trData = gradeTrackingData.filter(
		(trackingItem) =>
			!gradesData.some(
				(gradeItem) =>
					gradeItem.scan_id === trackingItem.scan_id &&
					gradeItem.test_problem_id === trackingItem.test_problem_id &&
					gradeItem.grade !== null
			)
	);

	if (trData.length < batch_size) {
		const { data: widerGradeTrackingData, error: widerGradeTrackingError } =
			await supabase
				.from("grade_tracking")
				.select("scan_id, test_problem_id")
				.lt("graded_count", 2)
				.gte("claimed_count", 2)
				.limit(batch_size - trData.length);
		if (widerGradeTrackingError) {
			throw widerGradeTrackingError;
		}

		trData.push(
			...widerGradeTrackingData.filter(
				(trackingItem) =>
					!gradesData.some(
						(gradeItem) =>
							gradeItem.scan_id === trackingItem.scan_id &&
							gradeItem.test_problem_id === trackingItem.test_problem_id &&
							gradeItem.grade !== null
					)
			)
		);
	}

	// Process the trTrackingData as needed

	const takerResponses: any[] = [];
	const { error: newGradeError } = await supabase.from("grades").upsert(
		trData.map((item) => ({
			grader_id,
			scan_id: item.scan_id,
			test_problem_id: item.test_problem_id,
		})),
		{ onConflict: "grader_id, scan_id, test_problem_id" }
	);

	if (newGradeError) {
		throw newGradeError;
	}

	for (const item of trData) {
		const { data: scanData, error: scanError } = await supabase
			.from("scans")
			.select("scan_path")
			.eq("id", item.scan_id)
			.single();
		if (scanError) {
			throw scanError;
		}

		const { data: testProblemData, error: testProblemError } = await supabase
			.from("test_problems")
			.select("problem_id, top_left_coords, bottom_right_coords")
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
			...problemData,
			image: await getImageUrl(scanData.scan_path),
			top_left: testProblemData.top_left_coords,
			bottom_right: testProblemData.bottom_right_coords,
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
