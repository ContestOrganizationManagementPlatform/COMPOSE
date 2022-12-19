<script>
	import { getThisUserRole } from "$lib/getUserRole.js";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let loaded = false;
	let isAdmin;

	let errorTrue = false;
	let errorMessage = "";

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
			errorTrue = true;
			errorMessage = error.message;
			isAdmin = false;
		}
	}
	loadIsAdmin();
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
{:else if isAdmin}
	<slot />
{:else}
	You're not allowed to be in here!
{/if}
