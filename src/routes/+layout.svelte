<script>
	import "carbon-components-svelte/css/white.css";
	import { supabase } from "$lib/supabaseClient";
	import Account from "$lib/components/Account.svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Menu from "$lib/components/Menu.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { browser } from "$app/environment";
	import { user } from "$lib/sessionStore";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	let loaded = false;

	console.log($page.route.id);

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
	{:else if !$user && hasAccount && $page.route.id != "/password-reset"}
		<Banner />
		<br />
		<div class="flex">
			<div style="background-color: var(--tinted-green); border-radius: 10px; width: fit-content; padding: 20px;">
				<Account logIn={true} />
				<br />
				<br />
				<div class="flex">
					<div class="bottomSection" style="color: white;">
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
			</div>
		</div>
	{:else if !$user && !hasAccount && $page.route.id != "/password-reset"}
	<Banner />
		<br />
		<div class="flex">
			<div style="background-color: var(--tinted-green); border-radius: 10px; width: fit-content; padding: 20px;">
				<Account logIn={false} />
				<br />
				<br />
				<div class="flex">
					<div class="bottomSection" style="color: white;">
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
		--tinted-green: #d9f5e2;
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

	:global(.bx--number input[type="number"]) {
		font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
		font-weight: 400;
		font-size: 14px;
	}
	:global(::placeholder),
	:global(.bx--text-area::placeholder) {
		font-family: "Ubuntu", "Roboto", Arial, -apple-system, BlinkMacSystemFont,
			"Segoe UI", Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
		font-size: 13px;
		font-weight: 300;
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
	:global(.profileButtons .button:focus),
	:global(.bx--btn--primary) {
		border-color: transparent !important;
		background-color: var(--green) !important;
		transition: all 0.3s ease-out;
	}
	:global(.buttonPrimaryLight) {
		border-color: var(--light-blue) !important;
		background-color: var(--body) !important;
	}
	:global(.profileButtons .button p) {
		color: white !important;
	}
	:global(.profileButtons .button:hover) {
		background-color: var(--light-blue) !important;
		border: 2px solid var(--green) !important;
	}
	:global(.buttonPrimaryLight:hover) {
		background-color: var(--light-blue) !important;
		border: 2px solid var(--body) !important;
	}
	:global(.profileButtons .button:hover p) {
		color: var(--green) !important;
	}

	:global(.buttonPrimaryLight:hover p) {
		color: var(--body) !important;
	}

	:global(.profileButtons .button:focus),
	:global(.profileButtons .bx--text-input:focus),
	:global(.profileButtons .bx--text-input:active) {
		border: 2px solid var(--green) !important;
		box-shadow: 2px solid var(--green) !important;
		outline-color: var(--green) !important;
	}
	:global(.link) {
		text-decoration: none !important;
		color: var(--body) !important;
	}

	:global(.link:visited) {
		text-decoration: none !important;
		color: var(--black) !important;
	}

	:global(.menu .link) {
		width: 50% !important;
		padding: 5px !important;
		color: var(--white) !important;
		text-decoration: none !important;
		outline: none !important;
	}

	:global(.menu .active) {
		text-decoration: underline !important;
		color: var(--white) !important;
	}

	:global(.bx--select-input:focus) {
		border-color: var(--green) !important;
		outline-color: var(--green) !important;
	}

	:global(.datatable) {
		width: 80% !important;
	}

	:global(.link),
	:global(.bx--data-table tr:hover .bx--link) {
		color: var(--black) !important;
	}

	:global(.bx--link:hover) {
		color: var(--green) !important;
		cursor: pointer !important;
	}

	:global(.bx--table-expand__button:focus) {
		box-shadow: none !important;
	}

	:global(.bx--loading__stroke) {
		stroke: var(--green) !important;
	}

	:global(.input) {
		border-width: 2px !important;
	}

	:global(.button),
	:global(.button:focus) {
		border-color: var(--body) !important;
		background-color: transparent !important;
	}
	:global(.button p) {
		color: var(--body) !important;
	}
	:global(.button:hover) {
		background-color: var(--body) !important;
	}
	:global(.button:hover p) {
		color: var(--white) !important;
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
	:global(.input:focus),
	:global(.textArea:focus),
	:global(.bx--text-input:focus),
	:global(.bx--text-input:active),
	:global(.bx--number input[type="number"]:focus),
	:global(.bx--text-area:focus) {
		border-color: var(--green) !important;
		outline-color: var(--green) !important;
	}

	:global(.bx--table-sort:focus) {
		border: none !important;
		outline: none !important;
	}
</style>
