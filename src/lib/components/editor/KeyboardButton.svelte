<script>
	import { Button } from "carbon-components-svelte";

	// needed to prevent taking focus
	let elemRef = null;
	$: if (elemRef) {
		elemRef.addEventListener("mousedown", (e) => {
			e.preventDefault();
		});
	}

	export let beforeText = "";
	export let afterText = "";
	export let displayText = "";
	export let clickHandler = () => {};
</script>

<Button
	kind="primary"
	class="button"
	size="small"
	on:click={(e) => {
		e.preventDefault();
		clickHandler(beforeText, afterText);
	}}
	bind:ref={elemRef}
	type="submit"
	style="margin-left: 5px; margin-right: 5px;"
>
	<p
		style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
	>
		{displayText}
	</p>
</Button>
