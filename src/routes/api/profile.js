import { supabase } from "$lib/supabaseClient";

export async function post({ request }) {
	const body = await request.json();
	if (body.full_name?.length >= 100) {
		return {
			status: 400,
			body: "Full name is too long (if this is an actual issue, please notify us)",
		};
	}
	if (body.discord?.length >= 50) {
		return {
			status: 400,
			body: "Discord is too long",
		};
	}
	if (body.initials?.length >= 6) {
		return {
			status: 400,
			body: "Initials are too long (max length 6)",
		};
	}

	const req = {
		id: body.id,
		full_name: body.full_name,
		discord: body.discord,
		initials: body.initials,
	};
	let { error } = await supabase.from("users").upsert(req, {
		returning: "minimal", // Don't return the value after inserting
	});
	if (error) {
		return {
			status: 400,
			body: error.message,
		};
	}
	return {
		status: 300,
	};
}
