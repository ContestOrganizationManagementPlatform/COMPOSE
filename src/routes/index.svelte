<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Form,
		TextInput,
		InlineNotification,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = false;
	let updatedProfile = false;
	let full_name;
	let discord;
	let initials;
	let quote;
	let mathComp;
	let amcScore;

	let errorTrue = false;
	let errorMessage = "";

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
				errorTrue = true;
				errorMessage = error.message;
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile(e) {
		e.preventDefault();
		try {
			// client side validation... endpoints are too hard :( :P
			if (full_name.length > 100) {
				errorTrue = true;
				errorMessage =
					"Full name is too long (if this is an actual issue, please notify us)";
			} else if (full_name.length <= 0) {
				errorTrue = true;
				errorMessage = "You must enter a full name";
			} else if (discord.length > 50) {
				errorTrue = true;
				errorMessage = "Discord is too long";
			} else if (!/^[^#]+#\d{4}$/.test(discord)) {
				errorTrue = true;
				errorMessage = "Discord format is invalid";
			} else if (initials.length > 5) {
				errorTrue = true;
				errorMessage = "Initials are too long";
			} else if (!/^[A-Z]+$/.test(initials)) {
				errorTrue = true;
				errorMessage = "Initials must be all uppercase letters";
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
				errorTrue = true;
				errorMessage =
					"You must enter a unique set of initials (try adding another letter)";
			} else {
				errorTrue = true;
				errorMessage = error.message;
			}
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

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

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
			<TextInput
				placeholder="Math Competition Background"
				style="width: 100%"
				bind:value={mathComp}
			/> <br />
			<TextInput
				placeholder="Best AMC 10/12 score (optional)"
				style="width: 100%"
				bind:value={amcScore}
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
