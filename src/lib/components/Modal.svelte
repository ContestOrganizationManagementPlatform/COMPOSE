<script>
	import { Button, Modal } from "carbon-components-svelte";

	let open = false;
	export let runHeader = "Delete Problem";
	export let onSubmit;
</script>

<Button
	kind="primary"
	class="button"
	size="small"
	type="submit"
	on:click={() => (open = true)}
	style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
>
	<p
		style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
	>
		{runHeader}
	</p>
</Button>

<Modal
	bind:open
	modalHeading="{runHeader}?"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit={onSubmit}
>
	Are you sure you want to perform action "{runHeader}"?
</Modal>

<style>
	:global(.bx--modal-container) {
		width: 40%;
	}
	:global(.bx--modal-container .bx--modal-close) {
		outline-color: var(--green);
		border-color: var(--green);
	}
	:global(.bx--modal-footer .bx--btn--secondary) {
		text-align: center;
		font-weight: 700;
	}
	:global(.bx--modal-container .bx--btn--primary) {
		background-color: var(--green);
		font-weight: 700;
	}
</style>
