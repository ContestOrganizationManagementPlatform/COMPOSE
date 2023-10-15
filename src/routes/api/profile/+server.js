import { upsertUserData } from "$lib/supabase";

export async function POST({ request }) {
	try {
		const body = await request.json();
		if (body.full_name?.length >= 100) {
			return new Response(
				"Full name is too long (if this is an actual issue, please notify us)",
				{ status: 400 }
			);
		}
		if (body.discord?.length >= 50) {
			return new Response("Discord is too long", { status: 400 });
		}
		if (body.initials?.length >= 6) {
			return new Response("Initials are too long (max length 6)", {
				status: 400,
			});
		}

		const req = {
			id: body.id,
			full_name: body.full_name,
			discord: body.discord,
			initials: body.initials,
		};
		await upsertUserData(req);

		return new Response(undefined, { status: 300 });
	} catch (error) {
		return new Response(error.message, { status: 400 });
	}
}
