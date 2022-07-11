<script>
	import "carbon-components-svelte/css/white.css";
	import { Loading } from "carbon-components-svelte";
</script>

<div class="outerDiv">
	<h1
		class="header"
		style="margin-bottom: 30px;font-weight: 700;margin-bottom: 20px;"
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

	h1 {
		color: #061333;
	}

	:global(.bx--loading__stroke) {
		stroke: #1c6825 !important;
	}
</style>
