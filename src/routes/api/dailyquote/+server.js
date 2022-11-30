export async function get() {
	const resp = await fetch("https://zenquotes.io/api/today");
	const item = await resp.json();

	return { body: item[0] };
}
