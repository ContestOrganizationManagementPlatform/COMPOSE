<script>
	import { displayLatex } from "$lib/latexStuff";
	import { ImageBucket } from "$lib/ImageBucket";
	import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
	import { unified } from "unified";
	import { processLatexViaUnified } from "@unified-latex/unified-latex";
	import rehypeStringify from "rehype-stringify";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";

	export let style = "";
	export let value;

	// fetch images
	let rendered;

	async function loadLatex() {
		try {
			const imageDownloadResult = await ImageBucket.downloadLatexImages(value);

			rendered = await displayLatex(value, imageDownloadResult.images);

			let unifiedStr = processLatexViaUnified()
				.use(unifiedLatexToHast)
				.use(rehypeStringify)
				.processSync(value).value;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	loadLatex();
</script>

{#if rendered}
	<span {style}>{@html rendered.out}</span>
{:else}
	<span {style}>Loading...</span>
{/if}
