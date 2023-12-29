import scheme from "$lib/scheme.json";


const discordToken = import.meta.env.VITE_BOT_TOKEN;

export async function POST({ request }) {
	console.log(request)
	const body = await request.json();
	console.log("BODY", JSON.stringify(body));

	// Create new thread and post first message
	const response = await fetch(
		`https://discord.com/api/v10/channels/${scheme.discord.notifs_forum}/threads`,
		{
			method: "POST",
			headers: {
				Authorization: `Bot ${discordToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		}
	);
	const data = await response.json();
	console.log("DATA", data);
	return new Response(data, { status: 300 });
}
