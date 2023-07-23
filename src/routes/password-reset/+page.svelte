<script>
	import { supabase } from "$lib/supabaseClient";
	import { TextInput, PasswordInput } from "carbon-components-svelte";
	import { page } from "$app/stores";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";

	let hash = $page.url.hash;
	let type = "";
	let accessToken = "";

	let showPasswordReset = false;

	if (hash !== "") {
		hash = hash.substring(1);
		let result = hash.split("&").reduce(function (res, item) {
			let parts = item.split("=");
			res[parts[0]] = parts[1];
			return res;
		}, {});
		type = result?.type ?? "";
		accessToken = result?.access_token ?? "";
	}

	let email = "";
	let password = "";
	let newPassword = "";

	const user = supabase.auth.user();

	function validateEmail(email) {
		var re =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return re.test(email);
	}
	async function resetPassword(payload) {
		try {
			clearInterval();
			if (validateEmail(email)) {
				if (type == "recovery") {
					toast.success(`Your password has been updated.`);
				} else {
					toast.success(`A reset password email has been sent to ${email}.`);
				}

				const { data, error } = await supabase.auth.api.resetPasswordForEmail(
					email,
					{ redirectTo: window.location.origin + "/password-reset" }
				);
				if (error) throw error;
			} else {
				toast.error("Your email is not valid!");
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

	function validatePassword(password) {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
		return re.test(password);
	}

	async function updateUser(payload) {
		clearInterval();
		if (validatePassword(password)) {
			if (password == newPassword) {
				showPasswordReset = true;
				setInterval(() => {
					showPasswordReset = false;
				}, 5000);

				const { error, data } = await supabase.auth.api.updateUser(
					accessToken,
					{
						password,
					}
				);
				if (error) {
					throw error.message;
				}
				window.location.href = "/";
			} else {
				toast.error("Your passwords should match.");

				setInterval(() => {
					error = false;
				}, 5000);
			}
		} else {
			toast.error(
				"Your password should contain 8 characters, an uppercase and lowercase letter, and a number."
			);

			setInterval(() => {
				error = false;
			}, 5000);
		}
	}
</script>

<Banner />
<br />
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
		<br />
		<div class="flex" style="width: 100%; margin-bottom: 0.75rem;">
			<div style="width: 30em;">
				<PasswordInput
					bind:value={newPassword}
					class="input"
					placeholder="Confirm new password"
				/>
			</div>
		</div>
		<Button action={updateUser} title="Reset Password" />
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
	{/if}
</div>
