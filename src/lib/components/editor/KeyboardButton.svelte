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
	style="margin-left: 5px; margin-right: 5px; margin-bottom: 3px;width: 1px;"
>
	<p style="font-size: 14px;">
		{displayText}
	</p>
</Button>
