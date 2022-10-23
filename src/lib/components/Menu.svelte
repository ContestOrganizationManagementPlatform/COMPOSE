<script>
	import Drawer from "svelte-drawer-component";
	import Banner from "./Banner.svelte";
	import { Link } from "carbon-components-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole.js";
	import { page } from "$app/stores";

	$: path = $page.routeId;

	let open = false;
	let fullname = "";
	let loading = false;
	let width = 0;
	let isAdmin;
	let userRole = 0;

	const user = supabase.auth.user();
	$: console.log(userRole);

	(async () => {
		userRole = await getThisUserRole();
		isAdmin = userRole >= 40;
		let { data: users, error } = await supabase
			.from("users")
			.select("full_name")
			.eq("id", user.id)
			.limit(1)
			.single();
		if (error) {
			fullname = "No Name";
		} else fullname = users.full_name;
	})();

	const handleSignout = async (e) => {
		e.preventDefault();
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
</script>

<svelte:window bind:outerWidth={width} />

<Drawer
	{open}
	size={width > 850 ? "30%" : width > 600 ? "50%" : "100%"}
	placement="left"
	on:clickAway={() => (open = false)}
>
	<div class="drawer">
		<div class="flex">
			<div class="banner">
				<Banner />
			</div>
		</div>
		<br />
		<div class="menu">
			<Link href="/" class={path == "" ? "active link" : "link"}>
				<p class="linkPara">Home</p>
			</Link>
			<br />
			{#if userRole}
				{#if userRole >= 20}
					<Link
						href="/problems/new"
						class={path == "problems/new" ? "active link" : "link"}
					>
						<p class="linkPara">Write New Problem</p>
					</Link>
					<br />
					<Link
						href="/problems"
						class={path == "problems" ? "active link" : "link"}
					>
						<p class="linkPara">Problem Inventory</p>
					</Link>
					<br />
					<Link
						href="/problems/import"
						class={path == "problems/import" ? "active link" : "link"}
					>
						<p class="linkPara">Import Problems</p>
					</Link>
					<br />
				{/if}
				<Link
					href="/testsolve"
					class={path == "testsolve" ? "active link" : "link"}
				>
					<p class="linkPara">View Testsolves</p>
				</Link>
				<br />
			{:else}
				You need to be verified to see other links.
			{/if}
			{#if userRole >= 30}
				<Link href="/tests" class={path == "tests" ? "active link" : "link"}>
					<p class="linkPara">View Tests</p>
				</Link>
			{/if}
			{#if isAdmin}
				<br />
				<div class="fixedHr" />
				<Link href="/admin" class={path == "admin" ? "active link" : "link"}>
					<p class="linkPara">Admin: Home</p>
				</Link>
				<br />
				<Link
					href="/admin/users"
					class={path == "admin/users" ? "active link" : "link"}
				>
					<p class="linkPara">Admin: Users</p>
				</Link>
				<br />
				<Link
					href="/admin/tests"
					class={path == "admin/tests" ? "active link" : "link"}
				>
					<p class="linkPara">Admin: Tests</p>
				</Link>
				<br />
				<Link
					href="/admin/tests/new"
					class={path == "admin/tests/new" ? "active link" : "link"}
				>
					<p class="linkPara">Admin: New Test</p>
				</Link>
				<br />
				<Link
					href="/admin/testsolves/upcoming"
					class={path == "admin/testsolves/upcoming" ? "active link" : "link"}
				>
					<p class="linkPara">Admin: Testsolves</p>
				</Link>
				<br />
				<Link
					href="/admin/tournaments"
					class={path == "admin/tournaments" ? "active link" : "link"}
				>
					<p class="linkPara">Admin: Tournaments</p>
				</Link>
			{/if}
			<br />
			<div class="fixedHr" />
			<Link on:click={handleSignout} class="link">
				<p class="linkPara">Sign Out</p>
			</Link>
		</div>
		<div class="bottomBanner">
			<p style="font-weight: 700;">{fullname}</p>
		</div>
	</div>
	<button class="close" on:click={() => (open = false)}>
		<i class="ri-menu-fold-line" />
	</button>
</Drawer>

<button on:click={() => (open = true)} class="unfoldButton">
	<i class="ri-menu-unfold-fill" />
</button>

<style>
	button {
		background-color: var(--green);
		border: none;
		outline: none;
		color: var(--white);
		padding: 10px;
		position: fixed;
		top: 20px;
		padding-left: 20px;
		left: 0;
		border-radius: 0 5px 5px 0;
	}

	.close {
		background-color: var(--body);
		z-index: 101;
	}

	.linkPara {
		color: var(--white);
		text-decoration: none;
		border: none;
		width: 100%;
		height: 5px;
		text-align: right;
	}

	.unfoldButton {
		z-index: 10;
	}

	.linkPara:hover {
		cursor: pointer;
		color: var(--body);
	}

	.close {
		display: block;
		margin-left: auto;
	}
	.drawer {
		background-color: var(--green);
		width: 100%;
		height: 100%;
		color: var(--white);
	}

	.banner {
		border-bottom: 2px solid var(--white);
		padding-bottom: 5px;
		width: 50%;
		position: relative;
	}

	.banner:before,
	.banner:after {
		position: absolute;
		bottom: -6px;
		left: 0;
		height: 10px;
		width: 10px;
		background: var(--white);
		content: "";
		border-radius: 5px;
	}

	.banner:after {
		right: 0;
		left: auto;
	}

	.bottomBanner {
		position: fixed;
		bottom: 0;
		background-color: var(--body);
		padding: 20px;
		width: 100%;
	}

	.fixedHr {
		width: 50%;
		border: 1px solid white;
		background-color: white;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		margin-bottom: 5px;
	}
</style>
