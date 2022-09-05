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
	import Modal from "$lib/components/Modal.svelte";

	let errorTrue = false;
	let errorMessage = "";

	const user = supabase.auth.user();
	let roles = [];
	let isOpen = true;
	async function roleManager() {
		let { data: users, error } = await supabase
			.from("users")
			.select("id,full_name,user_roles(role)")
			.order("full_name");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		for (let user of users) {
			const curRole = user.user_roles[0]?.role ?? 0;
			roles.push({
				user_id: user.id,
				role: curRole + "",
				name: user.full_name,
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
<h1>Admin: Roles</h1>

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
		{#each roles as role}
			<div class="box">
				<FormGroup disabled={role.user_id === user.id}>
					<h3><strong>{role.name}</strong></h3>
					<p><i>{role.user_id}</i></p>
					<Select labelText="Role" bind:selected={role.role}>
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
							isOpen = true;
							addRoleToUser(role.user_id, role.role);
						}}
					/>
				</FormGroup>
			</div>
		{/each}
	</Form>
</div>

<style>
	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 5px 20px;
	}
</style>
