<script>
	let drawer;
	const openDrawer = () => {
		drawer.addEventListener("sl-hide", (event) => console.log("hide"));
		drawer.show();
	};
</script>

<button on:click={openDrawer}><i class="ri-menu-unfold-fill"></i></button>

<sl-drawer placement="start" label="Drawer" class="drawer menu" bind:this={drawer}>
	<sl-select>
		<sl-menu-item value="option-1">Option 1</sl-menu-item>
		<sl-menu-item value="option-2">Option 2</sl-menu-item>
		<sl-menu-item value="option-3">Option 3</sl-menu-item>
	</sl-select>
</sl-drawer>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.34/dist/themes/base.css"
	/>
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.34/dist/shoelace.js"></script>
</svelte:head>

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

    sl-drawer {
        display: flex;
        height: 100%;
        border: 1px solid red;
    }
</style>