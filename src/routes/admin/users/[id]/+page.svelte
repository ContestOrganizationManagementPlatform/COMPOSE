<script>
	import { supabase } from "$lib/supabaseClient";
	import { page } from "$app/stores";
	import { Select, SelectItem, FormGroup } from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Loading from "$lib/components/Loading.svelte";

	let userId = $page.params.id;
	let user = {};
	let loading = true;

	async function fetchUser() {
		let { data: userInfo, error } = await supabase
			.from("users")
			.select("*,user_roles(role)")
			.eq("id", userId)
			.single();
		if (error) alert(error.message);
		else {
			user = {
				full_name: userInfo.full_name,
				discord: userInfo.discord,
				email: userInfo.email,
				initials: userInfo.initials,
				role: (userInfo.user_roles[0]?.role ?? 0) + "",
			};
		}
		loading = false;
	}

	async function addRoleToUser(role) {
		if (role === "0") {
			// special, delete role
			let { error } = await supabase
				.from("user_roles")
				.delete()
				.eq("user_id", userId);
			if (error) alert(error.message);
		} else {
			let { error } = await supabase.from("user_roles").upsert({
				user_id: userId,
				role,
			});
			if (error) alert(error.message);
		}
	}

	fetchUser();
</script>

{#if loading}
	<Loading />
{:else if !user.full_name}
	<p>User does not exist</p>
{:else}
	<div style="padding: 10px;">
		<h1>{user.full_name}</h1>
		<p><strong>User ID:</strong> {userId}</p>
		<p><strong>Discord:</strong> {user.discord}</p>
		<p><strong>Initials:</strong> {user.initials}</p>
		<p>
			<strong>Email:</strong>
			<a style="color: var(--green);" href="mailto:{user.email}">{user.email}</a
			>
		</p>
		<FormGroup disabled={userId === supabase.auth.user().id}>
			<Select labelText="Role" bind:selected={user.role}>
				<SelectItem value="0" text="No role assigned (0)" />
				<SelectItem value="10" text="No permissions (10)" />
				<SelectItem value="20" text="Problem Contributor (20)" />
				<SelectItem value="30" text="Problem Writer (30)" />
				<SelectItem value="40" text="Administrator (40)" />
			</Select>
			<br />
			<Modal
				runHeader="Update Role"
				onSubmit={() => {
					addRoleToUser(user.role);
				}}
			/>
		</FormGroup>
	</div>
{/if}
