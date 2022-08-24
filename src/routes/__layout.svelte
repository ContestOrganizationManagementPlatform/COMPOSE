<script>
	import "carbon-components-svelte/css/white.css";
	import { supabase } from "$lib/supabaseClient";
	import Account from "$lib/components/Account.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { browser } from "$app/env";
	import { user } from "$lib/sessionStore";
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
			<div class="bottomSection">
				<button
					size="lg"
					class="link"
					id="switchScreen"
					on:click={() => {
						hasAccount = false;
					}}>Sign-Up</button
				>
				<button size="lg" class="link" id="forgotPassword"
					><a href="/password-reset" style="color: black;">Forgot Password</a
					></button
				>
			</div>
		</div>
	{:else if !$user && !hasAccount}
		<Account logIn={false} />
		<br />
		<div class="flex">
			<div class="bottomSection">
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
					><a href="/password-reset" style="color: black;">Forgot Password</a
					></button
				>
			</div>
		</div>
	{:else}
		<Menu />
		<slot />
	{/if}
</main>

<style>
	:global(:root) {
		font-family: "Ubuntu", "Roboto", Arial, -apple-system, BlinkMacSystemFont,
			"Segoe UI", Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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

	.bottomSection {
		width: 30em;
	}

	@media only screen and (max-width: 700px) {
		.bottomSection {
			width: 80vw;
		}
	}

	:global(.flex) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.flex-dir-col) {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	:global(.profileButtons .button),
	:global(.profileButtons .button:focus) {
		border-color: transparent;
		background-color: var(--green);
	}
	:global(.profileButtons .button p) {
		color: white;
	}
	:global(.profileButtons .button:hover) {
		background-color: transparent;
		border: 2px solid var(--green) !important;
	}
	:global(.profileButtons .button:hover p) {
		color: var(--green);
	}
	:global(.profileButtons .button:focus),
	:global(.profileButtons .bx--text-input:focus),
	:global(.profileButtons .bx--text-input:active) {
		border: 2px solid var(--green);
		box-shadow: 2px solid var(--green);
		outline-color: var(--green);
	}
	:global(.link) {
		text-decoration: none;
		color: var(--body);
	}

	:global(.link:visited) {
		text-decoration: none;
		color: var(--black);
	}

	:global(.menu .link) {
		width: 50%;
		padding: 5px;
		color: var(--white);
		text-decoration: none !important;
		outline: none !important;
	}

	:global(.menu .active) {
		text-decoration: underline !important;
		color: var(--white) !important;
	}

	:global(.datatable) {
		width: 80%;
	}

	:global(.link),
	:global(.bx--data-table tr:hover .bx--link) {
		color: var(--black);
	}

	:global(.bx--link:hover) {
		color: var(--green) !important;
		cursor: pointer;
	}

	:global(.bx--table-expand__button:focus) {
		box-shadow: none;
	}

	:global(.bx--loading__stroke) {
		stroke: var(--green) !important;
	}

	:global(.input) {
		border-width: 2px;
	}

	:global(.button),
	:global(.button:focus) {
		border-color: var(--body);
		background-color: transparent;
	}
	:global(.button p) {
		color: var(--body);
	}
	:global(.button:hover) {
		background-color: var(--body);
	}
	:global(.button:hover p) {
		color: var(--white);
	}
	:global(.button:focus),
	:global(.input:focus) {
		border-color: var(--body) !important;
		outline: none;
		box-shadow: none;
	}

	:global(.button p) {
		margin-left: auto;
		margin-right: auto;
		font-size: 1.5em;
		font-weight: 500;
		padding: 0;
	}

	:global(.bx--select-input:focus),
	:global(.bx--select-input:active),
	:global(.textInput:focus),
	:global(.textArea:focus) {
		border-color: var(--green);
		outline-color: var(--green);
	}
</style>
