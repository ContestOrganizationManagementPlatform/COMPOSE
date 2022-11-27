<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Form,
		TextInput,
		InlineNotification,
		NumberInput,
		TextArea,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = false;
	let updatedProfile = false;
	let full_name;
	let discord;
	let initials;
	let quote;
	let math_comp_background;
	let amc_score;

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

			({ full_name, discord, initials, math_comp_background, amc_score } =
				data);
		} catch (error) {
			if (error.code === "PGRST116") {
				// no user
				full_name = "";
				discord = "";
				initials = "";
				amc_score = 0;
				math_comp_background = "";
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
			} else if (amc_score < 0 || amc_score > 150) {
				errorTrue = true;
				errorMessage = "AMC Score needs to be valid";
			} else if (math_comp_background.length <= 0) {
				errorTrue = true;
				errorMessage = "Math competition background cannot be empty";
			} else {
				loading = true;
				updatedProfile = false;
				const user = supabase.auth.user();

				const updates = {
					id: user.id,
					full_name,
					discord,
					initials,
					math_comp_background,
					amc_score,
					email: supabase.auth.user().email,
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

{#if updatedProfile}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="success"
			title="SUCCESS:"
			subtitle="Successfully updated profile!"
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
			<NumberInput
				placeholder="Best AMC 10/12 score (optional)"
				style="width: 100%"
				min={0}
				max={150}
				bind:value={amc_score}
			/> <br />
			<TextArea
				placeholder="Math Competition Background"
				style="width: 100%"
				bind:value={math_comp_background}
			/> <br />
			<Button title="Submit" />
		</Form>
		<br />
	</div>
</div>

<style>
	h3 {
		text-decoration: underline;
	}

	:global(.bx--number input[type="number"]) {
		border: none !important;
		border-bottom: 1px solid gray !important;
		outline: none !important;
	}

	:global(.bx--text-area) {
		min-height: 100px;
	}

	:global(.bx--text-area:focus, .bx--text-area:active) {
		outline-color: var(--green) !important;
	}

	:global(.bx--number__control-btn:focus) {
		border: none !important;
		outline: none !important;
	}
</style>
