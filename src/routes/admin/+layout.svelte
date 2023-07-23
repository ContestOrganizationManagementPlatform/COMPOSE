<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";

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
			toast.error(error.message);
			isAdmin = false;
		}
	}
	loadIsAdmin();
</script>

{#if !loaded}
	<Loading />
{:else if isAdmin}
	<slot />
{:else}
	You're not allowed to be in here!
{/if}
