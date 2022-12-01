/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch("/api/dailyquote");
	const json = await res.json();
	return { quote: json };
}
