<script>
	import "carbon-components-svelte/css/white.css";
	import { Button, Tile, MultiSelect } from "carbon-components-svelte";
    import Banner from '$lib/components/Banner.svelte';
	import Menu from '$lib/components/Menu.svelte';

	let _user = true;
	let user = true;
</script>

{#if user && _user}
<Menu />
{:else}
<Banner />
<br />
<h1 class="header" style="font-weight: 400;">
    Mustang Math Problem Writer Platform
</h1>
<br />
<p style="text-align: center;">
    You cannot add problems unless you are logged in.
</p>
<br />
<div class="flex">
    <Button
        kind="tertiary"
        class="button"
        style="width: 400px; padding: 0;"
        href="/login"
    >
        <p style="margin-left: auto; margin-right: auto;">Login</p>
    </Button>
</div>
<br />
<div class="flex">
    <Button
        kind="tertiary"
        class="button"
        style="width: 400px; padding: 0;"
        href="/signup"
    >
        <p style="margin-left: auto; margin-right: auto;">Sign Up</p>
    </Button>
</div>
{/if}

<style>
	h1 {
		font-weight: 800;
		text-align: center;
		margin: 0;
		padding: 0;
	}

	div :global(.button),
	div :global(.button:focus) {
		border-color: #65c083;
		background-color: transparent;
	}

	div :global(.button p) {
		color: #65c083;
	}

	div :global(.button:hover) {
		background-color: #65c083;
	}

	div :global(.button:hover p) {
		color: white;
	}
</style>
