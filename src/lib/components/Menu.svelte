<script>
	import Drawer from "svelte-drawer-component";
	import Banner from "./Banner.svelte";
	import { Link } from "carbon-components-svelte";
	let open = false;
</script>

<Drawer {open} size="30%" placement="left" on:clickAway={() => (open = false)}>
	<div class="drawer">
		<div class="flex">
			<button class="close" on:click={() => (open = false)}
				><i class="ri-menu-fold-line" /></button
			>
			<Banner />
		</div>
		<div style="display: block;">
			<Link href="/" class="link"><p class="linkPara">Home</p></Link><br />
			<Link href="/new-problem" class="link"
				><p class="linkPara">Create New Problem</p></Link
			><br />
			<Link href="/problems" class="link"
				><p class="linkPara">View Problems</p></Link
			><br />
			<Link href="/tests" class="link"><p class="linkPara">View Tests</p></Link>
		</div>
	</div>
</Drawer>

<button on:click={() => (open = true)}><i class="ri-menu-unfold-fill" /></button
>

<style>
	button {
		background-color: #1c6825;
		border: none;
		outline: none;
		color: white;
		padding: 10px;
		position: fixed;
		top: 20px;
		padding-left: 20px;
		left: 0;
		border-radius: 0 5px 5px 0;
	}

	:global(.link) {
		border: none;
	}

	.linkPara {
		color: white;
		text-decoration: none;
		border: none;
	}

	.linkPara:hover {
		cursor: pointer;
	}

	.close {
		display: block;
		margin-left: auto;
	}
	.drawer {
		background-color: #1c6825;
		width: 100%;
		height: 100%;
		color: white;
	}
</style>
