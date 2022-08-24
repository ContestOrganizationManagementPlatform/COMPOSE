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
			// client side validation... endpoints are too hard :(
			if (full_name.length > 100) {
				alert(
					"Full name is too long (if this is an actual issue, please notify us)"
				);
			} else if (full_name.length <= 0) {
				alert("You must enter a full name");
			} else if (discord.length > 50) {
				alert("Discord is too long");
			} else if (!/^[^#]+#\d{4}$/.test(discord)) {
				alert("Discord format is invalid");
			} else if (initials.length > 5) {
				alert("Initials are too long");
			} else if (!/^[A-Z]+$/.test(initials)) {
				alert("Initials must be all uppercase letters");
			} else {
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
			}
		} catch (error) {
			if (error.code === "23505") {
				alert(
					"You must enter a unique set of initials (try adding another letter)"
				);
			} else alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function getQuote() {
		let resp = await fetch("/api/dailyquote");
		quote = await resp.json();
	}

	getQuote();
	getProfile();
</script>

<br />
<h1 style="font-size: 5em;">Welcome, {full_name}</h1>
<h4 style="margin-bottom: 30px;">
	{#if quote}
		"{quote.q}" - {quote.a}
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
