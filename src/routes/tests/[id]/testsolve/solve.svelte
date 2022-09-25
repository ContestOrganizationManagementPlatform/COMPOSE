<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";

	let errorTrue = false;
	let errorMessage = "";

	let loading = true;
	let disallowed = true;

	async function getTest() {
		// check permission
		if (getThisUserRole() === 40) {
			disallowed = false;
		} else {
			let { data: testsolvers, error } = await supabase
				.from("testsolvers")
				.select("solver_id")
				.eq("test_id", $page.params.id)
				.eq("solver_id", supabase.auth.user().id);
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			} else if (testsolvers.length > 0) {
				disallowed = false;
			}
		}

		if (disallowed) {
			loading = false;
			return;
		}
	}
</script>

{#if loading}
	<p>Loading...</p>
{:else if disallowed}
	<p>You are not a testsolver for this test!</p>
{:else}
	<!-- TODO: show test -->
{/if}
