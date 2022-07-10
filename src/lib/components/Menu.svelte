<script>
	import Drawer from "svelte-drawer-component";
	import Banner from "./Banner.svelte";
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
		<p>Add menu buttons here</p>
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
