export async function GET() {
	const resp = await fetch("https://zenquotes.io/api/today");
	const item = await resp.json();

	return new Response(JSON.stringify(item[0]), {
		headers: {
			"content-type": "application/json; charset=utf-8",
		},
	});
}
