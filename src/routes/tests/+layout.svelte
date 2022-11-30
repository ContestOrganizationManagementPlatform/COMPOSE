<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let loaded = false;
	let isPW;

	let errorTrue = false;
	let errorMessage = "";

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
			errorTrue = true;
			errorMessage = err.message;
			isPW = false;
		}
	}
	loadIsPW();
</script>

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

{#if !loaded}
	<Loading />
{:else if isPW}
	<slot />
{:else}
	You cannot access this page unless you are a PW.
{/if}
