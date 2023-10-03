<script>
	import "carbon-components-svelte/css/white.css";
	import { Loading } from "carbon-components-svelte";
	import Header from "$lib/components/styles/Header.svelte";
</script>

<div class="outerDiv">
	<Header type="level1">Loading... Hang Tight!</Header>
	<br />
	<div class="flex">
		<Loading withOverlay={false} />
	</div>
</div>

<style>
	.outerDiv {
		display: block;
	}
</style>
