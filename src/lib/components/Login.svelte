<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import Banner from "$lib/components/Banner.svelte";
	import {
		Form,
		TextInput,
		Button,
		Link,
		PasswordInput,
	} from "carbon-components-svelte";

	let loading = false;
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
</script>

<Banner />
<Form
	style="display: flex;
	flex-direction: column;
	align-items: center;"
>
	<h1 class="header" style="margin-bottom: 30px;">Log In</h1>
	<TextInput bind:value={email} placeholder="email" style="width: 20em;" />
	<br />
	<PasswordInput
		bind:value={password}
		placeholder="password"
		style="width: 20em;"
	/> <br />
	<Button
		on:click={handleLogin}
		style="width: 20em; height: 2.5em; border-radius: 2.5em; padding: 0;"
	>
		<p style="margin-left: auto; margin-right: auto; font-size: 2em;">Enter</p>
	</Button>
</Form>

<div style="display: flex; flex-direction: row; justify-content: center;">
	<Link size="lg">Forgot Password</Link>
</div>
