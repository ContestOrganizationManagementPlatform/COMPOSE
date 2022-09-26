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
			.from("testsolves")
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
	<h1>Past Testsolve {testsolveId}</h1>
	<p>
		<strong>Test {testsolve.test_id}</strong>:
		<a href="/tests/{testsolve.test_id}">{testsolve.tests.test_name}</a>
	</p>
	<p><strong>Testsolver:</strong> {testsolve.users.full_name}</p>
	<p>
		<strong>Time:</strong>
		{testsolve.start_time
			? formatDate(new Date(testsolve.start_time))
			: "unknown"} to
		{testsolve.end_time ? formatDate(new Date(testsolve.end_time)) : "unknown"}
	</p>
	<div class="flex">
		<div class="feedback">
			<h4><strong>Feedback:</strong></h4>
			<p style="text-align: left;">{testsolve.feedback}</p>
		</div>
	</div>
{/if}

<style>
	.feedback {
		border-radius: 5px;
		border: 2px solid var(--green);
		width: 80%;
		margin: 5px;
		padding: 5px;
	}
</style>
