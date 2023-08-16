<script>
	import Banner from "$lib/components/Banner.svelte";
	import { Link } from "carbon-components-svelte";
</script>

<Banner />
<br />
<h1 class="header" style="margin-bottom: 30px;margin-bottom: 20px;">Error!</h1>
<p>
	The buttons on our calculator stopped working
	<i class="ri-emotion-unhappy-line" />
</p>
<br />
<div class="flex">
	<div class="button">
		<Link href="/" class="link"
			><p>Navigate Home <i class="ri-home-fill" /></p></Link
		>
	</div>
</div>

<style>
	:root {
		text-align: center;
	}

	.button {
		border: 2px solid var(--primary-light);
		width: 30em;
		padding: 10px;
		color: var(--primary-light);
	}

	.button:hover {
		background-color: var(--primary-light);
		color: var(--text-color-light);
	}
</style>
