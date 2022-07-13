<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Button,
		Tile,
		MultiSelect,
		Form,
		TextInput,
		Grid,
		Row,
		Column,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Menu from "$lib/components/Menu.svelte";

	let loading = false;
	let updatedProfile = false;
	let full_name;
	let discord;
	let initials;

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
	getProfile();
</script>

<Menu path="home" />
<br />
<h1 style="font-size: 5em;">Welcome /Name/</h1>
<h4 style="margin-bottom: 30px;">/Daily inspirational quote/</h4>
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
			<Button
				kind="primary"
				class="button"
				size="small"
				type="submit"
				style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
			>
				<p
					style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
				>
					Submit
				</p>
			</Button>
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

	:global(.profileButtons .button),
	:global(.profileButtons .button:focus) {
		border-color: transparent;
		background-color: var(--green);
	}
	:global(.profileButtons .button p) {
		color: white;
	}
	:global(.profileButtons .button:hover) {
		background-color: transparent;
		border: 2px solid var(--green) !important;
	}
	:global(.profileButtons .button:hover p) {
		color: var(--green);
	}
	:global(.profileButtons .button:focus),
	:global(.profileButtons .bx--text-input:focus),
	:global(.profileButtons .bx--text-input:active) {
		border: 2px solid var(--green);
		box-shadow: 2px solid var(--green);
		outline-color: var(--green);
	}
</style>
