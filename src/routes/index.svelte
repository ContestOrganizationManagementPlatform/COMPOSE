<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import {
		Button,
		Tile,
		MultiSelect,
		Form,
		TextInput,
	} from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Menu from "$lib/components/Menu.svelte";

	let loading = false;
	let updatedProfile = false;
	let full_name;
	let discord;
	let initials;

	const handleSignout = async () => {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	};

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
<Form on:submit={updateProfile}>
	<TextInput
		placeholder="Full Name"
		style="width: 20em;"
		bind:value={full_name}
	/> <br />
	<TextInput placeholder="Discord" style="width: 20em;" bind:value={discord} />
	<br />
	<TextInput
		placeholder="Initials"
		style="width: 20em;"
		bind:value={initials}
	/> <br />
	<Button type="submit">Submit</Button>
</Form>

{#if updatedProfile}
	<p>Successfully updated profile.</p>
{/if}

<form class="row flex flex-center" on:submit|preventDefault={handleSignout}>
	<div class="col-6 form-widget">
		<h1 class="header">Sign out</h1>
		<div>
			<input type="submit" class="button block" />
		</div>
	</div>
</form>

<style>
	h1 {
		font-weight: 800;
		text-align: center;
		margin: 0;
		padding: 0;
	}
</style>
