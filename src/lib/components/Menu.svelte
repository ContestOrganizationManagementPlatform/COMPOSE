<script>
	import Drawer from "svelte-drawer-component";
	import Banner from "./Banner.svelte";
	import { Link } from "carbon-components-svelte";
	let open = false;
	export let path;
</script>

<Drawer {open} size="30%" placement="left" on:clickAway={() => (open = false)}>
	<div class="drawer">
		<div class="flex">
			<div class="banner">
				<Banner />
			</div>
		</div>
		<br />
		<div style="display: block;">
			<Link href="/" class={path == 'home' ? 'active link' : 'link'}>
				<p class="linkPara">Home</p>
			</Link>
			<br />
			<Link
				href="/new-problem"
				class={path == 'new-problem' ? 'active link' : 'link'}>
				<p class="linkPara">Create New Problem</p>
			</Link>
			<br />
			<Link
				href="/problems"
				class={path == 'problems' ? 'active link' : 'link'}>
				<p class="linkPara">View Problems</p>
			</Link>
			<br />
			<Link href="/tests" class={path == 'tests' ? 'active link' : 'link'}>
				<p class="linkPara">View Tests</p>
			</Link>
		</div>
		<div class="bottomBanner">
			<p style="font-weight: 700;">/Name/</p>
		</div>
	</div>
	<button class="close" on:click={() => (open = false)}>
		<i class="ri-menu-fold-line" />
	</button>
</Drawer>

<button on:click={() => (open = true)}>
	<i class="ri-menu-unfold-fill" />
</button>

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

	.close {
		background-color: #65c083;
	}

	:global(.link) {
		width: 50%;
		padding: 5px;
		color: white;
		text-decoration: none !important;
		outline: none !important;
	}

	.linkPara {
		color: white;
		text-decoration: none;
		border: none;
		width: 100%;
		text-align: right;
	}

	.linkPara:hover {
		cursor: pointer;
		color: #65c083;
	}

	:global(.active) {
		text-decoration: underline !important;
		color: white !important;
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

	.banner {
		border-bottom: 2px solid white;
		padding-bottom: 15px;
		width: 50%;
		position: relative;
	}

	.banner:before,
	.banner:after {
		position: absolute;
		bottom: -6px;
		left: 0;
		height: 10px;
		width: 10px;
		background: white;
		content: "";
		border-radius: 5px;
	}

	.banner:after {
		right: 0;
		left: auto;
	}

	.bottomBanner {
		position: fixed;
		bottom: 0;
		background-color: #65c083;
		padding: 20px;
		width: 100%;
	}
</style>
