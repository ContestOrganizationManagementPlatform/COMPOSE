<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import { Form, TextInput, Button, Link } from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
</script>

<Banner />
<Form
	style="display: flex;
	flex-direction: column;
	align-items: center;"
>
	<h1 class="header" style="margin-bottom: 30px;">Sign Up</h1>
	<TextInput placeholder="email" style="width: 20em;" /> <br />
	<TextInput placeholder="password" style="width: 20em;" /> <br />
	<Button style="width: 20em; height: 2.5em; border-radius: 2.5em; padding: 0;">
		<p style="margin-left: auto; margin-right: auto; font-size: 2em;">Enter</p>
	</Button>
</Form> <br />

<div style="display: flex; flex-direction: column; align-items: center;">
	<Link size="lg" href="/login">Have an account? Log In</Link>
</div>