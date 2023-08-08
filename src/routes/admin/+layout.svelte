<script lang="ts">
	import { getThisUserRole } from "$lib/supabase/users";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";

	let loaded = false;
	let isAdmin: boolean;

	async function loadIsAdmin() {
		try {
			const role = await getThisUserRole();
			if (role >= 40) {
				isAdmin = true;
			} else {
				isAdmin = false;
			}
			loaded = true;
		} catch (error) {
			handleError(error);
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
