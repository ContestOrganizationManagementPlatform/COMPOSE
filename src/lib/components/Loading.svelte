<script>
	import "carbon-components-svelte/css/white.css";
	import { Loading } from "carbon-components-svelte";
</script>

<div class="outerDiv">
	<h1
		class="header"
		style="margin-bottom: 30px;margin-bottom: 20px;text-align: center;"
	>
		Loading... Hang Tight!
	</h1>
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
