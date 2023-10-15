import express from "express";
import cookieParser from "cookie-parser";

import { getUserStats, getUser } from "$lib/supabase";

import config from "./config.js";
import * as discord from "./discord.js";
import * as storage from "./storage.js";

/**
 * Main HTTP server used for the bot.
 */

const app = express();
app.use(cookieParser(config.COOKIE_SECRET));

/**
 * Example route that would be invoked when an external data source changes.
 * This example calls a common `updateMetadata` method that pushes static
 * data to Discord.
 */
app.post("/api/update-metadata", async (req, res) => {
	try {
		const userId = req.body.userId;
		await updateMetadata(userId);

		res.sendStatus(204);
	} catch (e) {
		res.sendStatus(500);
	}
});

/**
 * Given a Discord UserId, push static make-believe data to the Discord
 * metadata endpoint.
 */
export async function updateMetadata(userId) {
	// Fetch the Discord tokens from storage
	const user = await getUser(userId, "discord_id");
	console.log(user);
	const tokens = user.discord_tokens;
	//const tokens = await storage.getDiscordTokens(userId);
	const rows = await getUserStats(userId);
	console.log(rows);
	let metadata = {};
	try {
		// Fetch the new metadata you want to use from an external source.
		// This data could be POST-ed to this endpoint, but every service
		// is going to be different.  To keep the example simple, we'll
		// just generate some random data.
		if (rows.length == 1) {
			metadata = {
				verified: true,
				problemswritten: rows[0].problem_count,
			};
		} else {
			metadata = {
				verified: false,
				problemswritten: 0,
			};
		}
	} catch (e) {
		e.message = `Error fetching external data: ${e.message}`;
		console.error(e);
		// If fetching the profile data for the external service fails for any reason,
		// ensure metadata on the Discord side is nulled out. This prevents cases
		// where the user revokes an external app permissions, and is left with
		// stale linked role data.
	}

	// Push the data to Discord.
	console.log("Pushing Metadata", userId, tokens, metadata);
	await discord.pushMetadata(userId, tokens, metadata);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
