<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Form,
		TextInput,
		NumberInput,
		TextArea,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";

	export let data;

	let loading = false;
	let full_name;
	let discord;
	let initials;
	let quote;
	let math_comp_background;
	let amc_score;

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
				amc_score = "";
				math_comp_background = "";
			} else {
				toast.error(error.message);
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
				toast.error(
					"Full name is too long (if this is an actual issue, please notify us)"
				);
			} else if (full_name.length <= 0) {
				toast.error("You must enter a full name");
			} else if (discord.length > 50) {
				toast.error("Discord is too long");
			} else if (!/^[^#]+#\d{4}$/.test(discord)) {
				toast.error("Discord format is invalid");
			} else if (initials.length > 5) {
				toast.error("Initials are too long");
			} else if (!/^[A-Z]+$/.test(initials)) {
				toast.error("Initials must be all uppercase letters");
			} else if (amc_score < 0 || amc_score > 150) {
				toast.error("AMC Score needs to be valid");
			} else if (math_comp_background.length <= 0) {
				toast.error("Math competition background cannot be empty");
			} else {
				loading = true;
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

				toast.success("Successfully updated profile.");
			}
		} catch (error) {
			if (error.code === "23505") {
				toast.error(
					"You must enter a unique set of initials (try adding another letter)"
				);
			} else {
				toast.error(error.message);
			}
		} finally {
			loading = false;
		}
	}

	getProfile();
</script>

<br />
<h1 style="font-size: 5em;">Welcome, {full_name}</h1>
<br />
<h4 style="margin-bottom: 30px;font-style:italic;">
	{#if data.quote}
		"{data.quote.q}" - {data.quote.a}
	{:else}
		Loading inspirational quote...
	{/if}
</h4>
<div class="flex profileButtons">
	<div>
		<h3>Profile</h3>
		<br />

		<Form on:submit={updateProfile}>
			<div class="row" style="column-gap: 10px;">
				<TextInput
					placeholder="Full Name"
					style="width: 100%"
					bind:value={full_name}
				/>
				<TextInput
					placeholder="Initials"
					style="width: 100%"
					bind:value={initials}
				/>
			</div>
			<br />
			<div class="row" style="column-gap: 10px;">
				<TextInput
					placeholder="Discord"
					style="width: 100%"
					bind:value={discord}
				/>
				<NumberInput
					placeholder="Best AMC 10/12 score (optional)"
					style="width: 100%"
					min={0}
					max={150}
					step={0.1}
					bind:value={amc_score}
				/>
			</div>
			<br />
			<TextArea
				placeholder="Math Competition Background"
				style="width: 100%"
				bind:value={math_comp_background}
			/> <br />
			<Button title="Submit" fontSize="1.5em" />
		</Form>
		<br />
	</div>
</div>
