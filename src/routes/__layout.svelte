<script>
	import "carbon-components-svelte/css/white.css";
	import { supabase } from "$lib/supabaseClient";
	import Account from "$lib/components/Account.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { browser } from "$app/env";
	import { user } from "$lib/sessionStore";
	import { Button } from "carbon-components-svelte";
	import { onMount } from "svelte";

	let loaded = false;

	let hasAccount = true;
	// user.set(browser ? localStorage.getItem("user") : null);
	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});

	onMount(async () => {
		loaded = true;
	});

	// user.subscribe(val => browser ? localStorage.setItem("user", val) : null);
</script>

<main>
	{#if !loaded}
		<Banner />
		<div class="loadingPage flex">
			<Loading />
		</div>
	{:else if !$user && hasAccount}
		<Account logIn={true} />
		<br />
		<div class="flex">
			<div style="width: 30em;">
				<button
					size="lg"
					class="link"
					id="switchScreen"
					on:click={() => {
						hasAccount = false;
					}}>Sign-Up</button
				>
				<button size="lg" class="link" id="forgotPassword"
					>Forgot Password</button
				>
			</div>
		</div>
	{:else if !$user && !hasAccount}
		<Account logIn={false} />
		<br />
		<div class="flex">
			<div style="width: 30em;">
				<button
					size="lg"
					class="link"
					id="switchScreen"
					on:click={() => {
						hasAccount = true;
					}}
				>
					Log-In
				</button>
				<button size="lg" class="link" id="forgotPassword"
					>Forgot Password</button
				>
			</div>
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

	button {
		border: none;
		background-color: transparent;
		outline: none;
		color: none;
		color: var(--black);
		text-decoration: underline;
		font-size: 15px;
	}

	button:hover {
		color: var(--green);
		cursor: pointer;
	}

	#switchScreen {
		float: left;
	}
	#forgotPassword {
		float: right;
	}
</style>
