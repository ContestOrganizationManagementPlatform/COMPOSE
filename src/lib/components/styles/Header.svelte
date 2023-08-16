<script>
	export let type;
	export let fontSize = null;
</script>

<h1 class={type} style={fontSize ? `font-size: ${fontSize}` : ""}>
	<slot />
</h1>

<style>
	h1 {
		margin-bottom: var(--small-gap);
	}

	.level1 {
		color: var(--secondary-dark);
		font-weight: 700 !important;
	}

	.level3 {
		text-decoration: underline;
		font-size: 1.75rem;
	}
</style>
