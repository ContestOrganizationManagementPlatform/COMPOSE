<script>
	import "carbon-components-svelte/css/white.css";
	import { supabase } from "$lib/supabaseClient";
	import Login from "$lib/components/Login.svelte";
	import Signup from "$lib/components/Signup.svelte";
	import { browser } from "$app/env";
	import { user } from "$lib/sessionStore";
	import { Button } from "carbon-components-svelte";
	import { onMount } from "svelte";

	let loaded = false;

	let hasAccount = true;
	// user.set(browser ? localStorage.getItem("user") : null);
	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});

	onMount(async () => {
		loaded = true;
	});

	// user.subscribe(val => browser ? localStorage.setItem("user", val) : null);
</script>

<main>
	{#if !loaded}
		<p>Loading...</p>
	{:else if !$user && hasAccount}
		<Login />
		<Button
			on:click={() => {
				hasAccount = false;
			}}>Switch to Signup</Button
		>
	{:else if !$user && !hasAccount}
		<Signup />
		<Button
			on:click={() => {
				hasAccount = true;
			}}>Switch to Login</Button
		>
	{:else}
		<slot />
	{/if}
</main>

<style>
	main {
		padding: 10px;
		min-height: 100vh;
		margin: 0;
		padding: 0;
		background-color: #f5fffb;
	}
</style>
