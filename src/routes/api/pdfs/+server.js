export async function POST({ request }) {
	const body = await request.json();

	const resp = await fetch(
		// make env variable before pushing
		"https://PWP-Latex-PDF-Generator.mustang-mathmat.repl.co",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				latex: body.latex,
			}),
		}
	);
	return resp;
}
