<script>
	import { TextInput, PasswordInput } from "carbon-components-svelte";
	import { page } from "$app/stores";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";
	import { resetUserPassword, updateUserAuth } from "$lib/supabase";

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
	}

	let email = "";
	let password = "";
	let newPassword = "";

	function validateEmail(email) {
		var re =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return re.test(email);
	}
	async function resetPassword() {
		try {
			if (validateEmail(email)) {
				if (type == "recovery") {
					toast.success(`Your password has been updated.`);
				} else {
					toast.success(`A reset password email has been sent to ${email}.`);
				}

				await resetUserPassword(email);
			} else {
				toast.error("Your email is not valid!");
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	function validatePassword(password) {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
		return re.test(password);
	}

	async function updateUser() {
		try {
			clearInterval();
			if (validatePassword(password)) {
				if (password == newPassword) {
					await updateUserAuth(accessToken, password);
					toast.success("Successfully changed password.");
					window.location.href = "/";
				} else {
					throw new Error("Your passwords should match.");
				}
			} else {
				throw new Error(
					"Your password should contain 8 characters, an uppercase and lowercase letter, and a number."
				);
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
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
