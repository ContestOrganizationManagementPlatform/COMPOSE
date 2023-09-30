import { supabase } from "./supabaseClient";

interface GetSingleProblemOptions {
	id: string; // id of the problem
	archived?: boolean; // whether to fetch archived as well (default false)
	columns?: string; // the columns to query (default "*")
}

export async function getSingleProblem({
	id,
	columns = "*",
	archived = false,
}: GetSingleProblemOptions) {
	let fetched;
	if (archived) {
		fetched = await supabase
			.from("full_problems")
			.select("*")
			.eq("id", id)
			.limit(1)
			.maybeSingle();
	} else {
		fetched = await supabase
			.from("full_problems")
			.select(columns)
			.eq("id", id)
			.eq("archived", false)
			.limit(1)
			.maybeSingle();
	}

	if (fetched.error) throw fetched.error;
	if (!fetched.data) return null;
	return fetched.data;
}
