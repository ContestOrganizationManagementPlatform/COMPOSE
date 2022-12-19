import { supabase } from "$lib/supabaseClient";

export async function POST({ request }) {
	const body = await request.json();
	if (body.full_name?.length >= 100) {
		return new Response("Full name is too long (if this is an actual issue, please notify us)", { status: 400 });
	}
	if (body.discord?.length >= 50) {
		return new Response("Discord is too long", { status: 400 });
	}
	if (body.initials?.length >= 6) {
		return new Response("Initials are too long (max length 6)", { status: 400 });
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
		return new Response(error.message, { status: 400 });
	}
	return new Response(undefined, { status: 300 });
}
