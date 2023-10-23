import * as discord from "../../../lib/discord/discord.js";
import * as server from "../../../lib/discord/server.js";

import { redirect } from "@sveltejs/kit";

export async function POST({ request }) {
	try {
		const body = await request.json();
		console.log(body);
		const userId = body.userId;
		await server.updateMetadata(userId);

		return new Response("Success!", {
			status: 204,
		});
	} catch (e) {
		return new Response("Failed.", {
			status: 500,
		});
	}
}
