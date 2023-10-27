import { getUser } from "$lib/supabase";

const discordToken = import.meta.env.VITE_BOT_TOKEN;

export async function GET({ request }) {
	return "Hello";
}
export async function POST({ request }) {
	// Verify the authenticity of the request using Discord's public key and signature
	const isValidRequest = await verifyRequest(await request.text());

	if (!isValidRequest) {
		return {
			status: 401,
			body: "Unauthorized",
		};
	}

	// Parse the interaction data
	const interactionData = JSON.parse(request.body);

	// Check the type of interaction (1 for button click)
	if (interactionData.type === 1) {
		const customId = interactionData.data.custom_id;
		const name = interactionData.data.name;
		if (interactionData.data.name === "PING") {
			return {
				status: 200,
				body: JSON.stringify({
					type: 1, // Type 1 for acknowledging the interaction
				}),
			};
		}
		if (customId === "create-private-thread") {
			console.log("Thread Received!");
		}
	}

	return {
		status: 200,
		body: "Interaction received and handled",
	};
}
