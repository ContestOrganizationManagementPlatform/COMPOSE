<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;

	async function getTest() {
		let { data: tests, error } = await supabase
			.from("tests")
			.select("*,test_coordinators(users(*))")
			.eq("id", testId)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
		}
		test = tests;

		testCoordinators = test.test_coordinators.map((x) => x.users);
		loading = false;
	}

	getTest();
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1>Test: {test.test_name}</h1>
	<p>Description: {test.test_description}</p>
{/if}
