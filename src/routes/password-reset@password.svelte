<script>
	import { supabase } from "$lib/supabaseClient";
	import { TextInput, PasswordInput, Button } from "carbon-components-svelte";
	import { page } from "$app/stores";

	let hash = $page.url.hash;
	let type = "";
	let accessToken = "";
	if (hash !== "") {
		hash = hash.substring(1);
		let result = hash.split("&").reduce(function (res, item) {
			let parts = item.split("=");
			res[parts[0]] = parts[1];
			return res;
		}, {});
		type = result?.type ?? "";
		accessToken = result?.access_token ?? "";
		console.log(accessToken);
	}

	let email = "";
	let password = "";

	const user = supabase.auth.user();

	async function updateUser(payload) {
		const { error, data } = await supabase.auth.api.updateUser(accessToken, {
			password,
		});
		if (error) {
			throw error.message;
		}
	}

	async function resetPassword(payload) {
		const { data, error } = await supabase.auth.api.resetPasswordForEmail(
			email,
			{ redirectTo: window.location.origin + "/password-reset" }
		);
		if (error) {
			throw error.message;
		}
	}
</script>

<h1>Reset Password</h1>
{#if type == "recovery"}
	<PasswordInput bind:value={password} />
	<Button on:click={updateUser}>Reset Password</Button>
{:else}
	<TextInput bind:value={email} label="email" />
	<Button on:click={resetPassword}>Reset Password</Button>
{/if}
