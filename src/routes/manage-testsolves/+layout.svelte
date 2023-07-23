<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";

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
		} catch (err) {
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
	You're not allowed to be in here!
{/if}
