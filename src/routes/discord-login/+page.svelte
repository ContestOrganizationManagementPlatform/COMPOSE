<script lang="ts">
	import { TextArea, Select, SelectItem } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import { getThisUser } from "$lib/supabase";

	let user;

	(async () => {
		user = await getThisUser();
	})();

	async function auth() {
		user = await getThisUser();
		console.log("user");
		window.location.replace(`/api/linked-role?userId=${user.id}`);
	}
</script>

<br />
<h1>Connect with Discord</h1>

<form on:submit|preventDefault style="padding: 20px;">
	<Button
		action={async () => {
			await auth();
		}}
		classs="discordbutton"
		title="Authenticate with Discord"
	/>
</form>

<style>
</style>
