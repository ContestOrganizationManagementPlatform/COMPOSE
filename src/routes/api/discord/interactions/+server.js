import { getUser } from "$lib/supabase";

import { sign } from "tweetnacl";
const discordToken = import.meta.env.VITE_BOT_TOKEN;

const PUBLIC_KEY =
	"f01b581c59fc6a02c3a4eea8dc277dd3276abc8ca639cf694c3d23eb6ce79000";

// Verification function (You can use a separate utility function for this)
async function verifyRequest(req, body) {
	// Implement request verification logic using Discord's public key
	// You can find the verification process in the Discord API documentation
	// Return true if the request is valid, otherwise return false
	const signature = req.headers.get("X-Signature-Ed25519");
	const timestamp = req.headers.get("X-Signature-Timestamp");
	console.log(signature, timestamp, body);
	const isVerified = sign.detached.verify(
		Buffer.from(timestamp + body),
		Buffer.from(signature, "hex"),
		Buffer.from(PUBLIC_KEY, "hex")
	);
	console.log(isVerified);
	return isVerified; // For the sake of this example, we assume the request is valid
}

export async function GET({ request }) {
	return new Response("👋");
}
export async function POST({ request }) {
	console.log("POST REQUEST", request);
	// Verify the authenticity of the request using Discord's public key and signature
	let text = await request.text();
	const isValidRequest = await verifyRequest(request, text);
	text = JSON.parse(text);

	if (!isValidRequest) {
		return new Response({}, { status: 401, statusText: "Unauthorized" });
	}
	console.log("TEXT", text);
	console.log("TYPE", text.type);
	// Check the type of interaction (1 for button click)
	if (text.type === 1) {
		const resp = new Response(
			JSON.stringify({
				type: 1, // Type 1 for acknowledging the interaction
			}),
			{ status: 200, statusText: "Interaction Received" }
		);
		return resp;
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
		JSON.stringify({
			type: 1, // Type 1 for acknowledging the interaction
		}),
		{ status: 200, statusText: "Interaction Received" }
	);
	console.log("RESP", resp);
	return resp;
}
