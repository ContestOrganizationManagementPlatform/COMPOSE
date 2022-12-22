<script>
	import { displayLatex } from "$lib/latexStuff";
	import { ImageBucket } from "$lib/ImageBucket";

	export let style = "";
	export let value;

	// fetch images
	let rendered;

	async function loadLatex() {
		const imageDownloadResult = await ImageBucket.downloadLatexImages(value);

		rendered = displayLatex(value, imageDownloadResult.images);
	}
	loadLatex();
</script>

{#if rendered}
	<span {style}>{@html rendered.out}</span>
{:else}
	<span {style}>Loading...</span>
{/if}
