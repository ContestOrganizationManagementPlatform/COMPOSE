<script>
	import { Button } from "carbon-components-svelte";
	export let title;
	export let action;
	export let classs = "button";
	export let href = null;
	export let fontSize = "1em";
</script>

{#if href}
	<Button
		kind="primary"
		class={classs}
		size="small"
		{href}
		type="submit"
		style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
	>
		<p
			style="margin-left: auto; margin-right: auto; font-size: {fontSize};font-weight: 500;padding: 0;"
		>
			{title}
		</p>
	</Button>
{:else}
	<Button
		kind="primary"
		class={classs}
		size="small"
		on:click={action}
		type="submit"
		style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
	>
		<p
			style="margin-left: auto; margin-right: auto; font-size: {fontSize};font-weight: 500;padding: 0;"
		>
			{title}
		</p>
	</Button>
{/if}
