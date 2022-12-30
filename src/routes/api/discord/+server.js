import {
	EmbedBuilder,
	WebhookClient,
	ButtonStyle,
	ButtonBuilder,
	ActionRowBuilder,
} from "discord.js";

export async function POST({ request }) {
	let token = import.meta.env.VITE_DISCORD_TOKEN;
	let id = import.meta.env.VITE_DISCORD_ID;
	const body = await request.json();

	try {
		const webhookClient = new WebhookClient({ id: id, token: token });

		let topics = "None";
		if (body.problem.topics && body.problem.topics.length > 0) {
			topics = body.problem.topics
				.map(
					(element) =>
						["", "Algebra", "Combinatorics", "Geometry", "Number Theory"][
							element
						]
				)
				.join(", ");
		}

		const embed = new EmbedBuilder()
			.setTitle("Problem Created: " + body.front_id)
			.setColor(6660998)
			//.setTimestamp(body.created_at)
			.setURL("https://compose.mustangmath.com/problems/" + body.id)
			.setAuthor({
				name: body.authorName,
				url: "https://compose.mustangmath.com/problems/" + body.id,
				iconURL: "https://mustangmath.com/logo.png",
			})
			.setFooter({ text: "Problem Created By " + body.authorName })
			.addFields(
				{
					name: "Topics",
					value: topics,
					inline: true,
				},
				{
					name: "Sub-Topics",
					value:
						body.problem.sub_topics != "" ? body.problem.sub_topics : "None",
					inline: true,
				},
				{
					name: "Difficulty",
					value: body.problem.difficulty + "",
					inline: true,
				},
				{
					name: "Problem",
					value: body.problem.problem_latex,
				},
				{
					name: "Answer",
					value: body.problem.answer_latex,
				},
				{
					name: "Solution",
					value: body.problem.solution_latex,
				},
				{
					name: "Comments",
					value: body.problem.comment_latex,
				}
			);
		
		if (body.image != "") {
			embed.setImage(body.image);
		}

		const buttonRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel("View Problem")
				.setURL("https://compose.mustangmath.com/problems/" + body.id)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setLabel("Edit Problem")
				.setURL("https://compose.mustangmath.com/problems/" + body.id + "/edit")
				.setStyle(ButtonStyle.Link)
		);

		webhookClient.send({
			username: "Problem Writing Platform",
			avatarURL: "https://mustangmath.com/logo.png",
			embeds: [embed],
			components: [buttonRow],
		});

		return new Response("Works!", {
			status: 200,
			headers: { "content-type": "application/text" },
		});
	} catch (e) {
		console.log(e.message);
		return new Response(e.message, {
			status: 400,
		});
	}
}
