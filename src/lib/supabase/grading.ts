import { supabase } from "../supabaseClient";
import { archiveProblem } from "./problems";
import { supabase } from "../supabaseClient";
import { archiveProblem } from "./problems";

async function fetchData(): Promise<any[]> {
    const { data, error } = await supabase
        .rpc('execute_sql', { sql: `
            SELECT
                pgc.scan_id,
                pgc.problem_index,
                pgc.grading_count
            FROM
                public.response_grading_count pgc
            WHERE
                pgc.grading_count < 2
                AND NOT EXISTS (
                    SELECT 1
                    FROM public.response_grades rg
                    INNER JOIN public.taker_responses tr ON rg.taker_response_id = tr.id
                    WHERE tr.scan_id = pgc.scan_id
                          AND tr.problem_index = pgc.problem_index
                          AND rg.grader_id = 99
                );
        `});

    if (error) {
        throw error;
    }
    // Fetch object_path for each data item
    for (let item of data) {
        const { data: scanData, error: scanError } = await supabase
            .from('public.scans')
            .select('test_id, object_path')
            .eq('id', item.scan_id);
        if (scanError) {
            throw scanError;
        }
        // Add object_path to the item
        item.object_path = scanData[0]?.object_path;

        const { data: problemData, error: problemError } = await supabase
            .from('public.test_problems')
            .select('problem_id')
            .eq('test_id', scanData[0]?.test_id)
            .eq('problem_number', item.problem_index);
        if (problemError) {
            throw problemError;
        }
        // Add problem_id to the item
        item.problem_id = problemData[0]?.problem_id;
    }


    return data;
}



async function testFetchData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

testFetchData();
