export async function POST({ request }) {
	let discordWebhook = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
	const body = await request.json();
	try {
		const discordBody = body.customMessage
			? body.message
			: {
					content:
						"New problem submitted!\nProblem: " +
						body.problem_latex +
						"\nComment: " +
						body.comment_latex +
						"\nAnswer: " +
						body.answer_latex +
						"\nSolution: " +
						body.solution_latex +
						"\nTopic: " +
						body.topics
							.map(
								(element) =>
									["", "Algebra", "Combinatorics", "Geometry", "Number Theory"][
										element
									]
							)
							.join(", ") +
						"\nSub-Topics: " +
						body.sub_topics +
						"\nDifficulty: " +
						body.difficulty,
			  };
		const res = await fetch(discordWebhook, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(discordBody),
		});
		const data = await res.json();
		return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json; charset=utf-8'
            }
        });
	} catch (e) {
		return new Response(error.message, {
            status: 400
        })
	}
}
