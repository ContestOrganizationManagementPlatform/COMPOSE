<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		TextInput,
		Form,
		FormGroup,
		Select,
		InlineNotification,
		SelectItem,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";

	let errorTrue = false;
	let errorMessage = "";

	const user = supabase.auth.user();
	let roles = [];
	let isOpen = true;
	async function roleManager() {
		let { data: users, error } = await supabase
			.from("users")
			.select("id,full_name,initials,user_roles(role)")
			.order("full_name");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		roles = [];
		for (let user of users) {
			const curRole = user.user_roles[0]?.role ?? 0;
			roles.push({
				user_id: user.id,
				role: curRole + "",
				name: user.full_name,
				initials: user.initials,
			});
		}
		roles = roles;
	}

	async function addRoleToUser(user_id, roleNum) {
		if (roleNum === "0") {
			// special, delete role
			let { error } = await supabase
				.from("user_roles")
				.delete()
				.eq("user_id", user_id);
			if (error) alert(error.message);
		} else {
			let { error } = await supabase.from("user_roles").upsert({
				user_id,
				role: roleNum,
			});
			if (error) alert(error.message);
		}
	}

	roleManager();
</script>

<br />
<h1>Admin: Users</h1>

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

<div style="padding: 10px;">
	<Form>
		<div class="grid-thirds">
			{#each roles as role}
				<div class="box" style="padding-bottom: 0 !important;">
					<FormGroup disabled={role.user_id === user.id}>
						<a href={"/admin/users/" + role.user_id}
							><h3><strong>{role.name} ({role.initials})</strong></h3></a
						>
						<p><i>{role.user_id}</i></p>
						<br />
						<Button title="Update" href={"/admin/users/" + role.user_id} />
					</FormGroup>
				</div>
			{/each}
		</div>
	</Form>
</div>

<style>
	a {
		text-decoration: none;
		color: black;
	}

	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 5px 20px;
	}
</style>
