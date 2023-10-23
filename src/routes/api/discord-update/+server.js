import { WebhookClient } from "discord.js";
import scheme from "$lib/scheme.json";

export async function POST({ request }) {
	let token = import.meta.env.VITE_CLIENT_TOKEN;
	let id = import.meta.env.VITE_CLIENT_ID;
	const body = await request.json();

	try {
		const webhookClient = new WebhookClient({ id: id, token: token });

		webhookClient.send({
			username: "Problem Writing Platform",
			avatarURL: scheme.logo,
			content: body.updater + " " + body.update + " problem " + body.id,
		});

		return new Response("Works!", {
			status: 200,
			headers: { "content-type": "application/text" },
		});
	} catch (e) {
		return new Response(e.message, {
			status: 400,
		});
	}
}
