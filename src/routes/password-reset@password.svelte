<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		TextInput,
		PasswordInput,
		InlineNotification,
	} from "carbon-components-svelte";
	import { page } from "$app/stores";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";

	let hash = $page.url.hash;
	let type = "";
	let accessToken = "";

	let showPasswordReset = false;
	let checkOutEmail = false;
	let error = false;
	let errorMessage = "";

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

	function validateEmail(email) {
		var re =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return re.test(email);
	}
	async function resetPassword(payload) {
		clearInterval();
		if (validateEmail(email)) {
			checkOutEmail = true;
			setInterval(() => {
				checkOutEmail = false;
			}, 5000);

			const { data, error } = await supabase.auth.api.resetPasswordForEmail(
				email,
				{ redirectTo: window.location.origin + "/password-reset" }
			);
			if (error) {
				throw error.message;
			}
		} else {
			error = true;
			errorMessage = "Your email is not valid!";

			setInterval(() => {
				error = false;
			}, 5000);
		}
	}

	function validatePassword(password) {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
		return re.test(password);
	}

	async function updateUser(payload) {
		clearInterval();
		if (validatePassword(password)) {
			showPasswordReset = true;

			setInterval(() => {
				showPasswordReset = false;
			}, 5000);

			const { error, data } = await supabase.auth.api.updateUser(accessToken, {
				password,
			});
			if (error) {
				throw error.message;
			}
			window.location.href = "/";
		} else {
			error = true;
			errorMessage =
				"Your password should contain 8 characters, an uppercase and lowercase letter, and a number.";

			setInterval(() => {
				error = false;
			}, 5000);
		}
	}
</script>

<Banner />
<br />
{#if error}
	<div style="position: fixed; top: 20px; left: 20px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="Error:"
			subtitle={errorMessage}
		/>
	</div>
{/if}
<h1>Reset Password</h1>
<div style="padding: 20px;overflow: hidden;">
	{#if type == "recovery"}
		<div class="flex" style="width: 100%; margin-bottom: 0.75rem;">
			<div style="width: 30em;">
				<PasswordInput
					bind:value={password}
					class="input"
					placeholder="New password"
				/>
			</div>
		</div>
		<Button action={updateUser} title="Reset Password" />
		{#if checkOutEmail}
			<div style="position: fixed; top: 20px;">
				<InlineNotification
					lowContrast
					kind="info"
					title="Updates:"
					subtitle="Your password has been updated."
				/>
			</div>
		{/if}
	{:else}
		<div class="flex" style="width: 100%; margin-bottom: 0.75rem;">
			<div style="width: 30em;">
				<TextInput
					class="input"
					placeholder="Email"
					bind:value={email}
					label="email"
					type="email"
					required
				/>
			</div>
		</div>
		<Button action={resetPassword} title="Send Email" />
		{#if checkOutEmail}
			<div style="position: fixed; top: 20px;">
				<InlineNotification
					lowContrast
					kind="success"
					title="Email sent:"
					subtitle={`A reset password email has been sent to ${email}.`}
				/>
			</div>
		{/if}
	{/if}
</div>

<style>
	:global(.bx--inline-notification__close-button) {
		outline: none;
		border: none;
	}
</style>
