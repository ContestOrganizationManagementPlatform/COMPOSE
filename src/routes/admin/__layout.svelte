<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";

	let loaded = false;
	let isAdmin;

	async function loadIsAdmin() {
		try {
			const role = await getThisUserRole();
			if (role >= 40) {
				isAdmin = true;
			} else {
				isAdmin = false;
			}
			loaded = true;
		} catch (err) {
			alert(err.message);
			isAdmin = false;
		}
	}
	loadIsAdmin();
</script>

{#if !loaded}
	Loading...
{:else if isAdmin}
	<slot />
{:else}
	You're not allowed to be in here!
{/if}
