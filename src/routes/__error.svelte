<script>
	import Banner from "$lib/components/Banner.svelte";
	import { Link } from "carbon-components-svelte";
</script>

<Banner />
<br />
<h1
	class="header"
	style="margin-bottom: 30px;font-weight: 700;margin-bottom: 20px;"
>
	Error!
</h1>
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

	h1 {
		color: #061333;
	}

	.button {
		border: 2px solid #65c083;
		width: 30em;
		padding: 10px;
		color: #65c083;
	}

	.button:hover {
		background-color: #65c083;
		color: white;
	}

	:global(.link),
	:global(.link:visited) {
		text-decoration: none;
		color: #65c083;
	}
</style>
