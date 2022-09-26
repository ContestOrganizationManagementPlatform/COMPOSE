<script>
	import { displayLatex } from "$lib/latexStuff";

	export let style = "";
	export let value;

	let rendered = displayLatex(value);
</script>

<span {style}>{@html rendered.out}</span>
