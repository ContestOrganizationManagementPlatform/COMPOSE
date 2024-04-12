import { supabase } from "../supabaseClient";

async function getImageUrl(
	path: string,
	bucket: string = "scans",
): Promise<string | null> {
	const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
	return data?.publicUrl || null;
}

export async function uploadScan(
	file: any,
	test_id: string,
	page_number: string,
	front_id: string,
) {
	let { data, error: upload_error } = await supabase.storage
		.from("scans")
		.upload(`test_${test_id}/${front_id}/page_${page_number}.png`, file, {
			upsert: true,
		});
	if (upload_error) throw upload_error;

	let { error: upsert_error } = await supabase.from("scans").upsert(
		{ test_id, taker_id: front_id, page_number, scan_path: data.path },
		{
			onConflict: "test_id,taker_id,page_number",
		},
	);
	if (upsert_error) throw upsert_error;
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

// If test_problem_id not specified (null), looks at other problem ids in the
// same test, starting with lower # of unique grader_id entries that are claimed
// but not graded (pending).
//
// Returns scans in groups of their problem ids sorted by # unique grader_id's,
// then sorted in increasing order by their claimed_count.
//
// All returned scans have graded_count < 2.
//
// If no scans, returns empty list.
export async function fetchNewTakerResponses(
	grader_id: number,
	batch_size: number | null = null,
	test_id: number | null = null,
	test_problem_id: number | null = null,
	only_conflicted: boolean,
): Promise<any[]> {
	// If test_problem_id is not specified, order all other problems by num_graders.
	let test_problem_id_list = [];
	if (test_problem_id == null) {
		const { data: testData, error: testError } = await supabase
			.from("test_problem_grader_tracking")
			.select("test_id, num_graders, test_problem_id")
			.eq("test_id", test_id)
			.order("num_graders", { ascending: false });
		if (testError) {
			throw testError;
		}
		test_problem_id_list = testData.map((d) => d.test_problem_id);
	} else {
		test_problem_id_list = [test_problem_id];
	}

	let output = [];
	for (const test_problem_id of test_problem_id_list) {
		if (output.length >= batch_size) {
			break;
		}
		// Get the scans that this grader has graded for this test_problem_id.
		// These scans should not be given again.
		const { data: gradesData, error: gradesError } = await supabase
			.from("grades")
			.select("scan_id, test_problem_id, grade")
			.eq("grader_id", grader_id)
			.eq("test_problem_id", test_problem_id)
			.not("grade", "is", null);
		if (gradesError) {
			throw gradesError;
		}

		let query = supabase
			.from("grade_tracking")
			.select("scan_id, test_id, test_problem_id")
			.eq("test_problem_id", test_problem_id)
			// Absolutely do not return problems that have already been graded twice.
			.lt("graded_count", 2)
			.order("claimed_count")
			// Ignore scans that this grader has graded.
			.not(
				"scan_id",
				"in",
				`(${gradesData.map((row) => row.scan_id).join(",")})`,
			)
			.limit(batch_size - output.length);

		// Override the query to be just conflicted items.
		// We thus do not care if this admin has graded a problem or not
		// (they will override anyway).
		if (only_conflicted) {
			query = supabase
				.from("grade_tracking")
				.select("scan_id, test_id, test_problem_id")
				.eq("test_problem_id", test_problem_id)
				.eq("needs_resolution", true)
				.limit(batch_size - output.length);
		}

		const { data: gradeTrackingData, error: gradeTrackingError } = await query;
		if (gradeTrackingError) {
			throw gradeTrackingError;
		}

		// Mark that this grader claims these scans.
		const { error: newGradeError } = await supabase.from("grades").upsert(
			gradeTrackingData.map((item) => ({
				grader_id,
				scan_id: item.scan_id,
				test_problem_id: item.test_problem_id,
			})),
			{ onConflict: "grader_id, scan_id, test_problem_id" },
		);
		if (newGradeError) {
			throw newGradeError;
		}

		// Process the trTrackingData as needed
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

			const { data: otherGradeData, error: otherGradeError } = await supabase
				.from("grades")
				.select("grade")
				.eq("scan_id", item.scan_id)
				.eq("test_problem_id", item.test_problem_id);
			if (otherGradeError) {
				throw otherGradeError;
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
				.select("test_name, bounding_boxes")
				.eq("id", item.test_id)
				.single();
			if (testError) {
				throw testError;
			}

			const { data: testProblemData, error: testProblemError } = await supabase
				.from("test_problems")
				.select("problem_id, problem_number")
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

			output.push({
				...item,
				...testData,
				...problemData,
				...testProblemData,
				grades: otherGradeData,
				grade_id: gradeData.id,
				image: await getImageUrl(scanData.scan_path),
			});
		}
	}

	return output;
}

export async function submitGrade(grader_id: number, data: any): Promise<void> {
	// if (data.is_override ?? false) {
	// 	const { data: existingRow, error } = await supabase
	// 		.from("grades")
	// 		.select("*")
	// 		.eq("scan_id", data.scan_id)
	// 		.eq("test_problem_id", data.test_problem_id)
	// 		.eq("is_override", true)
	// 		.single();
	// 	if (error) {
	// 		throw error;
	// 	}
	// 	if (existingRow) {
	// 		return;
	// 	}
	// }
	const { error } = await supabase
		.from("grades")
		.upsert(
			{ ...data, grader_id },
			{ onConflict: "grader_id,scan_id,test_problem_id" },
		);
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

export async function getGrades() {
	const { data: gradeTrackingData, error: gradeTrackingError } = await supabase
		.from("grade_tracking")
		.select("scan_id,test_id,correct")
		.eq("grade_finalized", true);
	if (gradeTrackingError) {
		throw gradeTrackingError;
	}

	const scores = {};

	for (const row of gradeTrackingData) {
		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("test_name")
			.eq("id", row.test_id)
			.single();

		if (testError) {
			throw testError;
		}

		const test_name = testData.test_name;
		if (!Object.keys(scores).includes(test_name)) {
			scores[test_name] = {};
		}

		const { data: scanData, error: scanError } = await supabase
			.from("scans")
			.select("taker_id")
			.eq("id", row.scan_id)
			.single();
		if (scanError) {
			throw scanError;
		}
		const taker_id = scanData.taker_id;
		if (typeof taker_id === "string" && /[A-Z]$/.test(taker_id)) {
			const { data: teamStudentData, error: teamStudentError } = await supabase
				.from("team_students")
				.select("student_id")
				.eq("student_num", taker_id)
				.single();
			if (teamStudentError) {
				throw teamStudentError;
			}
			
			const { data: studentData, error: studentError } = await supabase
				.from("students")
				.select("first_name,last_name")
				.eq("id", teamStudentData.student_id)
				.single();
			if (studentError) {
				throw studentError;
			}

			if (!Object.keys(scores[test_name]).includes(taker_id)) {
				scores[test_name][taker_id] = {
					name: `${studentData.first_name} ${studentData.last_name}`,
					score: 0,
					grades: [],
				};
			}
			scores[test_name][taker_id].score += row.correct ? 1 : 0;
			scores[test_name][taker_id].grades.push(row.correct);
		} else {
			const { data: teamData, error: teamError } = await supabase
				.from("teams")
				.select("name")
				.eq("number", taker_id)
				.single();
			if (teamError) {
				throw teamError;
			}

			if (!Object.keys(scores[test_name]).includes(taker_id)) {
				scores[test_name][taker_id] = {
					name: teamData.name,
					score: 0,
					grades: [],
				};
			}
			scores[test_name][taker_id].score += row.correct ? 1 : 0;
			scores[test_name][taker_id].grades.push(row.correct);
		}
	}
	return scores;
}
