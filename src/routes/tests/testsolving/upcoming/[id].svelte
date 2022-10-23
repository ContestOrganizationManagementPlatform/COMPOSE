<script>
	import { supabase } from "$lib/supabaseClient.js";
	import { page } from "$app/stores";
	import { formatDate } from "$lib/formatDate.js";
	import Loading from "$lib/components/Loading.svelte";

	let testsolveId = $page.params.id;
	let testsolve = {};
	let loading = true;

	async function getTestsolve() {
		let { data: testsolveData, error } = await supabase
			.from("testsolvers")
			.select("*,users(full_name),tests(test_name)")
			.eq("id", testsolveId)
			.limit(1)
			.single();
		if (error) alert(error.message);
		else testsolve = testsolveData;
		loading = false;
	}

	getTestsolve();
</script>

<br />
{#if loading}
	<Loading />
{:else}
	<h1>Upcoming Testsolve {testsolveId}</h1>
	<br />
	<p>
		<strong>Test {testsolve.test_id}</strong>:
		<a href="/tests/{testsolve.test_id}">{testsolve.tests.test_name}</a>
	</p>
	<p><strong>Testsolver:</strong> {testsolve.users.full_name}</p>
{/if}
