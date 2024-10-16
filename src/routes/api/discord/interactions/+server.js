import nacl from "tweetnacl";
import {fetchSettings} from "$lib/supabase";
import {
	InteractionResponseType,
	InteractionType,
	InteractionResponseFlags,
} from "discord-interactions";
const discordToken = import.meta.env.VITE_BOT_TOKEN;

const PUBLIC_KEY = import.meta.env.VITE_BOT_PUBLIC_KEY;

let scheme = {};

// Function to fetch settings
async function loadSettings() {
    scheme = await fetchSettings(); // Fetch settings from the database
}
//Change
async function verifyRequest(req, body) {
	const signature = req.headers.get("X-Signature-Ed25519");
	const timestamp = req.headers.get("X-Signature-Timestamp");
	const isVerified = nacl.sign.detached.verify(
		Buffer.from(timestamp + body),
		Buffer.from(signature, "hex"),
		Buffer.from(PUBLIC_KEY, "hex")
	);
	console.log(isVerified);
	return isVerified;
}

class JsonResponse extends Response {
	constructor(body, init) {
		const jsonBody = JSON.stringify(body);
		init = init || {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		};
		super(jsonBody, init);
	}
}

export async function GET({ request }) {
	return new Response("👋");
}
export async function POST({ request }) {
	await loadSettings();
	// Verify the authenticity of the request using Discord's public key and signature
	let text = await request.text();
	const isValidRequest = await verifyRequest(request, text);
	text = JSON.parse(text);

	if (!isValidRequest) {
		return new Response({}, { status: 401, statusText: "Unauthorized" });
	}
	// Check the type of interaction (1 for button click)
	if (text.type === InteractionType.PING) {
		// The `PING` message is used during the initial webhook handshake, and is
		// required to configure the webhook in the developer portal.
		return new JsonResponse({
			type: InteractionResponseType.PONG,
		});
	} else if (text.type === 3) {
		if (text.data.custom_id === "create-thread") {
			console.log("Thread Button");
			const author_id = text.channel.recipients[0].id;
			const solver_id = text.message.embeds[0].footer.text;
			console.log(text);
			const embed = text.message.embeds[0];
			const problem_id = embed.title.replace(
				"Feedback received on problem ",
				""
			);

			const response = await fetch(
				`https://discord.com/api/v10/channels/${scheme.discord.thread_channel}/messages`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${discordToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						content: "",
						embeds: [embed],
						components: [
							{
								type: 1,
								components: [text.message.components[0].components[0]],
							},
						],
					}),
				}
			);
			const message_id = (await response.json()).id;
			const response2 = await fetch(
				`https://discord.com/api/v10/channels/${scheme.discord.thread_channel}/messages/${message_id}/threads`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${discordToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: problem_id,
					}),
				}
			);
			const thread_id = (await response2.json()).id;
			const response3 = await fetch(
				`https://discord.com/api/v10/channels/${thread_id}/messages`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${discordToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						content:
							"<@" +
							author_id +
							"> <@" +
							solver_id +
							"> Thread created to discuss Problem " +
							problem_id +
							".",
					}),
				}
			);

			const response4 = await fetch(
				`https://discord.com/api/v10/channels/${text.channel_id}/messages/${text.message.id}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bot ${discordToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						content: "",
						embeds: [embed],
						components: [
							{
								type: 1,
								components: [text.message.components[0].components[0]],
							},
						],
					}),
				}
			);

			return new JsonResponse({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: "<#" + thread_id + "> created.",
					flags: InteractionResponseFlags.EPHEMERAL,
				},
			});
		}
	}
	const resp = new Response(
		JSON.stringify({
			type: 1, // Type 1 for acknowledging the interaction
		}),
		{ status: 200, statusText: "Interaction Received" }
	);
	return resp;
}
