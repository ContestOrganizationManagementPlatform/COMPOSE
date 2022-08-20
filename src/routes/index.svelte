<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import { Form, TextInput } from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = false;
	let updatedProfile = false;
	let full_name;
	let discord;
	let initials;
	let quote;

	const getProfile = async () => {
		try {
			loading = true;
			const user = supabase.auth.user();

			let { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", user.id)
				.limit(1)
				.single();

			if (error) throw error;

			({ full_name, discord, initials } = data);
		} catch (error) {
			if (error.code === "PGRST116") {
				// no user
				full_name = "";
				discord = "";
				initials = "";
			} else {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile(e) {
		e.preventDefault();
		try {
			loading = true;
			updatedProfile = false;
			const user = supabase.auth.user();

			const updates = {
				id: user.id,
				full_name,
				discord,
				initials,
			};

			let { error } = await supabase.from("users").upsert(updates, {
				returning: "minimal", // Don't return the value after inserting
			});

			if (error) throw error;

			updatedProfile = true;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function getQuote() {
		console.log("hi!");
		let resp = await fetch("/api/dailyquote");
		quote = await resp.json();
		console.log(quote);
	}

	getQuote();
	getProfile();
</script>

<br />
<h1 style="font-size: 5em;">Welcome, {full_name}</h1>
<h4 style="margin-bottom: 30px;">
	{#if quote}
		"{quote.q}" -{quote.a}
	{:else}
		Loading inspirational quote...
	{/if}
</h4>
<div class="flex profileButtons">
	<div>
		<h3>Profile</h3>
		<br />

		<Form on:submit={updateProfile}>
			<TextInput
				placeholder="Full Name"
				style="width: 100%"
				bind:value={full_name}
			/> <br />
			<TextInput
				placeholder="Discord"
				style="width: 100%"
				bind:value={discord}
			/>
			<br />
			<TextInput
				placeholder="Initials"
				style="width: 100%"
				bind:value={initials}
			/> <br />
			<Button title="Submit" />
		</Form>
		{#if updatedProfile}
			<br />
			<p>Successfully updated profile.</p>
		{/if}
	</div>
</div>

<style>
	h3 {
		text-decoration: underline;
	}
</style>
