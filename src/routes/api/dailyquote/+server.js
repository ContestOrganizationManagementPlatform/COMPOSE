export async function GET() {
	const resp = await fetch("https://zenquotes.io/api/today");
	const item = await resp.json();
	
	return new Response(item[0]);
}
