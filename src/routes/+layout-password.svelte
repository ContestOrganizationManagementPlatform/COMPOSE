<script>
	import { user } from "$lib/sessionStore";
	import { supabase } from "$lib/supabaseClient";
	import Banner from "$lib/components/Banner.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { onMount } from "svelte";

	user.set(supabase.auth.user());

	let loaded = false;
	onMount(async () => {
		loaded = true;
	});

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});
</script>

<main>
	{#if !loaded}
		<Banner />
		<div class="loadingPage flex">
			<Loading />
		</div>
	{:else}
		<slot />
	{/if}
</main>

<style>
	:global(:root) {
		--white: #fff;
		--black: #000;
		--hair: #213d44;
		--body: #65c083;
		--hooves: #5b8064;
		--blue: #1b9aaa;
		--tinted-blue: #b9c6d2;
		--tinted-green: #abddbc;
		--green: #1c6825;
		--light-blue: #f5fffb;
		--dark-blue: #061333;
	}

	:global(.flex) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	main {
		padding: 10px;
		min-height: 100vh;
		margin: 0;
		padding: 0;
		background-color: var(--light-blue);
	}

	.loadingPage {
		width: 100vw;
		height: 80vh;
	}

	:global(.bx--loading__stroke) {
		stroke: var(--green) !important;
	}
</style>
