import { getUser } from "$lib/supabase";

const discordToken = import.meta.env.VITE_BOT_TOKEN;

export async function POST({ request }) {
	const body = await request.json();
	console.log(body);
	//get user's discord ID
	const user = await getUser(body.userId);
	const discordId = user.discord_id;

	//Get the user DM
	const response = await fetch(
		`https://discord.com/api/v10/users/@me/channels`,
		{
			method: "POST",
			headers: {
				Authorization: `Bot ${discordToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipient_id: discordId,
			}),
		}
	);
	const data = await response.json();

	console.log("DATA", data);

	//Send the user a DM
	const channelId = data.id;

	const resp = await fetch(
		`https://discord.com/api/v10/channels/${channelId}/messages`,
		{
			method: "POST",
			headers: {
				Authorization: `Bot ${discordToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: body.message,
				embeds: body.embeds,
				components: body.components,
			}),
		}
	);
	console.log("RESPONSE", resp);

	return new Response(undefined, { status: 300 });
}
