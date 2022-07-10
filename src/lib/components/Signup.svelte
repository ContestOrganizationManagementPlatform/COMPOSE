<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Form,
		TextInput,
		Button,
		Link,
		PasswordInput,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";

	let loading = false;
	let signupSuccess = false;
	let email;
	let password;
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
<Form
	style="display: flex;
	flex-direction: column;
	align-items: center;"
>
	<h1 class="header" style="margin-bottom: 30px;">Sign Up</h1>
	<TextInput placeholder="email" style="width: 20em;" bind:value={email} />
	<br />
	<PasswordInput
		placeholder="password"
		style="width: 20em;"
		bind:value={password}
	/> <br />
	<Button
		on:click={handleSignUp}
		style="width: 20em; height: 2.5em; border-radius: 2.5em; padding: 0;"
	>
		<p style="margin-left: auto; margin-right: auto; font-size: 2em;">Enter</p>
	</Button>
</Form>
{#if signupSuccess}
	<p>Successfully signed up, check your email to confirm!</p>
{/if}
<br />
