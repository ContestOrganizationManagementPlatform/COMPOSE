<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";

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
			alert(err.message);
			isPW = false;
		}
	}
	loadIsPW();
</script>

{#if !loaded}
	Loading...
{:else if isPW}
	<slot />
{:else}
	You cannot access this page unless you are a PW.
{/if}
