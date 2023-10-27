import { getUser } from "$lib/supabase";

const discordToken = import.meta.env.VITE_BOT_TOKEN;

// Verification function (You can use a separate utility function for this)
async function verifyRequest(requestBody) {
	// Implement request verification logic using Discord's public key
	// You can find the verification process in the Discord API documentation
	// Return true if the request is valid, otherwise return false
	return true; // For the sake of this example, we assume the request is valid
}

export async function GET({ request }) {
	return new Response("👋");
}
export async function POST({ request }) {
	console.log("POST REQUEST", request);
	// Verify the authenticity of the request using Discord's public key and signature
	const text = await request.text();
	const isValidRequest = await verifyRequest(text);
	console.log("TEXT", text);

	if (!isValidRequest) {
		return {
			status: 401,
			body: "Unauthorized",
		};
	}
	// Check the type of interaction (1 for button click)
	if (text.type === 1) {
		const customId = interactionData.data.custom_id;
		const name = interactionData.data.name;
		console.log(customId, name);
		if (text.data.name === "PING") {
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
	const resp = new Response(
		{
			type: 1, // Type 1 for acknowledging the interaction
		},
		{ status: 200, statusText: "Interaction Received" }
	);
	console.log("RESP", resp);
	return resp;
}
