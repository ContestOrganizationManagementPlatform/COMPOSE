<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import scheme from '$lib/scheme.json';
</script>

<div class="header">
	<img src="/MMTLogo.png" alt="MMTLogo" width="50" height="50" />
	<h4>{scheme.title}</h4>
</div>

<style>
	.header {
		padding: 5px;
		color: var(--text-color-light);
		display: flex;
		align-items: center;
		background-color: var(--primary);
	}

	.header h4 {
		font-weight: 600;
		font-variant: small-caps;
	}
</style>
