<script>
	import { Button, Modal } from "carbon-components-svelte";

	let open = false;

	export let description;
</script>

// https://carbon-components-svelte.onrender.com/components/Modal

<Button on:click={() => (open = true)}>Create database</Button>

<Modal
	bind:open
	modalHeading="Create database"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit
>
	{description}
</Modal>
