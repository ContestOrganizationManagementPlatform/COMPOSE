<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import Button from "$lib/components/Button.svelte";
	import { Form, TextInput, PasswordInput } from "carbon-components-svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		createAccount,
		signIntoAccount,
		signInWithDiscord,
	} from "$lib/supabase";

	export let logIn: boolean;
	let loading = false;
	let signupSuccess = false;
	let email: string;
	let password: string;
	let retypePassword: string;

	const handleLogin = async () => {
		try {
			loading = true;
			await signIntoAccount(email, password);
		} catch (error) {
			handleError(error);
			toast.error(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};

	const handleSignUp = async () => {
		try {
			if (password == retypePassword) {
				try {
					loading = true;
					await createAccount(email, password);
					signupSuccess = true;
				} catch (error) {
					throw error;
				} finally {
					loading = false;
				}
			} else {
				throw new Error("Passwords do not match");
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	};
</script>

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
		style="width: 35em;"
	/>
	<br />
	<PasswordInput
		bind:value={password}
		class="input"
		placeholder="Password"
		style="width: 35em;"
	/> <br />
	{#if !logIn && password != ""}
		<PasswordInput
			bind:value={retypePassword}
			class="input"
			placeholder="retype password"
			style="width: 35em;"
		/> <br />
	{/if}
	<div class="profileButtons">
		{#if logIn}
			<Button title="Enter" action={handleLogin} />
		{:else}
			<Button title="Enter" action={handleSignUp} />
		{/if}
	</div>
</Form>
{#if signupSuccess}
	<p style="text-align: center;">
		Successfully signed up, check your email to confirm!
	</p>
	<br />
{/if}

<style>
	.header {
		font-size: 50px;
	}

	:global(
			.bx--text-input--password__visibility,
			.bx--btn.bx--text-input--password__visibility__toggle.bx--tooltip__trigger:focus
		) {
		outline-color: var(--primary) !important;
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
