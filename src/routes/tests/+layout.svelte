<script>
	import { getThisUserRole } from "$lib/supabase";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";

	let loaded = false;
	let isPW;

	async function loadIsPW() {
		try {
			const role = await getThisUserRole();
			if (role >= 30) {
				isPW = true;
			} else {
				isPW = false;
			}
			loaded = true;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
			isPW = false;
		}
	}
	loadIsPW();
</script>

{#if !loaded}
	<Loading />
{:else if isPW}
	<slot />
{:else}
	You cannot access this page unless you are a PW.
{/if}
