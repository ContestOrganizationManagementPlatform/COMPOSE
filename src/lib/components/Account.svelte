<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import Banner from "$lib/components/Banner.svelte";
	import {
		Form,
		TextInput,
		Button,
		PasswordInput,
	} from "carbon-components-svelte";

	export let logIn;
	let loading = false;
	let signupSuccess = false;
	let email;
	let password;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({
				email: email,
				password: password,
			});
			if (error) throw error;
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};

	const handleSignUp = async () => {
		try {
			loading = true;
			const { user, session, error } = await supabase.auth.signUp({
				email: email,
				password: password,
			});
			if (error) throw error;
			signupSuccess = true;
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};
</script>

<Banner />
<br />
<Form
	style="display: flex;
	flex-direction: column;
	margin-top: 20px;
	align-items: center;"
>
	<h1
		class="header"
		style="margin-bottom: 30px;font-weight: 700;margin-bottom: 20px;"
	>
		{#if logIn}
			Log In
		{:else}
			Sign Up
		{/if}
	</h1>
	<TextInput
		class="input"
		bind:value={email}
		placeholder="email"
		style="width: 30em;"
	/>
	<br />
	<PasswordInput
		bind:value={password}
		class="input"
		placeholder="password"
		style="width: 30em;"
	/> <br />
	{#if logIn}
		<Button
			kind="tertiary"
			class="button"
			size="small"
			on:click={handleLogin}
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
		>
			<p
				style="margin-left: auto; margin-right: auto; font-size: 1.5em;font-weight: 500;padding: 0;"
			>
				Enter
			</p>
		</Button>
	{:else}
		<Button
			kind="tertiary"
			class="button"
			size="small"
			on:click={handleSignUp}
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
		>
			<p
				style="margin-left: auto; margin-right: auto; font-size: 1.5em;font-weight: 500;padding: 0;"
			>
				Enter
			</p>
		</Button>
	{/if}
</Form>
{#if signupSuccess}
	<p style="text-align: center;">
		Successfully signed up, check your email to confirm!
	</p>
	<br />
{/if}

<style>
	h1 {
		color: #061333;
	}

	:global(.input) {
		border-width: 2px;
	}

	:global(.button),
	:global(.button:focus) {
		border-color: #65c083;
		background-color: transparent;
	}
	:global(.button p) {
		color: #65c083;
	}
	:global(.button:hover) {
		background-color: #65c083;
	}
	:global(.button:hover p) {
		color: white;
	}
	:global(.button:focus),
	:global(.input:focus) {
		border-color: #65c083 !important;
		outline: none;
		box-shadow: none;
	}
</style>
