<script>
	import "carbon-components-svelte/css/white.css";
	import { Theme, ProgressBar } from "carbon-components-svelte";
	export let value = 20;
	export let max = 100;
	export let labelText = "Progress";
	export let helperText = numerator + "/" + denominator;
	console.log(value);
	console.log("hi");
</script>

<Theme
	theme="g90"
	tokens={{
		"interactive-01": "#d02670",
		"hover-primary": "#ee5396",
		"active-primary": "#9f1853",
	}}
/>

<div class="outerDiv">
	<br />
	<ProgressBar
		class="custom-progress-bar"
		style="--progressbar-complete-background: blue;"
		{value}
		{max}
		{labelText}
		{helperText}
	/>
</div>

<style>
	.outerDiv {
		display: block;
	}
	.bx--progress-bar__bar {
		/* Your custom styles here */
		color: rgb(162, 255, 0); /* Change this to your desired color */
	}
</style>
