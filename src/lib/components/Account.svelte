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
	let retypePassword;

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
		if (password == retypePassword) {
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
		} else {
			alert("ERROR: Passwords do not match");
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
	<h1 class="header" style="margin-bottom: 30px;">
		{#if logIn}
			Log In
		{:else}
			Sign Up
		{/if}
	</h1>
	<TextInput
		class="input"
		bind:value={email}
		placeholder="Email"
		style="width: 30em;"
	/>
	<br />
	<PasswordInput
		bind:value={password}
		class="input"
		placeholder="Password"
		style="width: 30em;"
	/> <br />
	{#if !logIn && password != ""}
		<PasswordInput
			bind:value={retypePassword}
			class="input"
			placeholder="retype password"
			style="width: 30em;"
		/> <br />
	{/if}
	{#if logIn}
		<Button
			kind="tertiary"
			class="button"
			size="small"
			on:click={handleLogin}
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
		>
			<p>Enter</p>
		</Button>
	{:else}
		<Button
			kind="tertiary"
			class="button"
			size="small"
			on:click={handleSignUp}
			style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
		>
			<p>Enter</p>
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
	:global(.bx--text-input--password__visibility, .bx--btn.bx--text-input--password__visibility__toggle.bx--tooltip__trigger:focus) {
		outline-color: var(--green);
	}
	@media only screen and (max-width: 700px) {
		:global(.button) {
			width: 80vw !important;
		}

		:global(.input) {
			width: 80vw !important;
		}
	}
</style>
