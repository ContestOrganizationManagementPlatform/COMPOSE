export async function POST({ request }) {
	let discordWebhook = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
	const body = await request.json();
	console.log(body);
	try {
		const discordBody = body.customMessage
			? body.message
			: {
					username: "Mustang Math",
					avatar_url: "https://mustangmath.com/logo.png",
					embeds: [
						{
							title: "Problem Created: " + body.front_id,
							color: 6660998,
							timestamp: body.created_at,
							url:
								"https://problem-writing-platform.vercel.app/problems/id/" +
								body.id,
							author: {
								name: body.authorName,
								url: "",
								icon_url: "https://mustangmath.com/logo.png",
							},
							image: {},
							thumbnail: {},
							footer: {
								text: "Problem Created By " + body.authorName,
							},
							fields: [
								{
									name: "Topics",
									value: body.problem.topics
										.map(
											(element) =>
												[
													"",
													"Algebra",
													"Combinatorics",
													"Geometry",
													"Number Theory",
												][element]
										)
										.join(", "),
									inline: true,
								},
								{
									name: "Sub-Topics",
									value: body.problem.sub_topics,
									inline: true,
								},
								{
									name: "Difficulty",
									value: body.problem.difficulty,
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
								},
							],
						},
					],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: "View Problem",
									url:
										"https://problem-writing-platform.vercel.app/problems/id/" +
										body.id,
								},
								{
									type: 2,
									style: 5,
									label: "Edit Problem",
									url:
										"https://problem-writing-platform.vercel.app/problems/id/" +
										body.id +
										"/edit",
								},
							],
						},
					],
			  };
		console.log(JSON.stringify(discordBody));
		const res = await fetch(discordWebhook, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(discordBody),
		});
		const data = await res.json();
		console.log(data);
		return new Response(JSON.stringify(data), {
			headers: {
				"content-type": "application/json; charset=utf-8",
			},
		});
	} catch (e) {
		return new Response(e.message, {
			status: 400,
		});
	}
}
