import { Routes } from "discord-api-types/v9";
import { getUser } from "$lib/supabase";
import { rest } from "$lib/discord/discordBot";

const clientId = import.meta.env.VITE_CLIENT_ID;
const guildId = import.meta.env.VITE_DISCORD_ID;

export async function POST({ request }) {
	const body = await request.json();

    //get user's discord username
    const user = await getUser(body.userId);
    const discordUsername = user.discord;

    //get user's discord ID
    const response = await fetch('https://discord.com/api/v10/guilds/' + guildId + '/members/search/?query=' + discordUsername);
    const json = await response.json();
    const discordId = json.id;

    console.log(discordId);

    //send the user the direct message
    const recipient = await rest.put(
        Routes.user(Discord.ClientUser.me(clientId)),
        {
            data: {
                id: discordId,
                type: 1,
            },
        }
    );

    await rest.post(Routes.channelMessages(recipient.id), {
        data: {
            content: body.message,
        },
    });
}