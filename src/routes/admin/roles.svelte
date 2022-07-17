<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Button,
		TextInput,
		Form,
		FormGroup,
		Select,
		SelectItem,
		Modal,
	} from "carbon-components-svelte";
	import Menu from "$lib/components/Menu.svelte";
	{
		/* import Modal from "$lib/components/Modal.svelte"; */
	}

	const user = supabase.auth.user();
	let roles = [];
	let isOpen = true;
	async function roleManager() {
		let { data: users, error } = await supabase
			.from("users")
			.select("id,full_name,user_roles(role)")
			.order("full_name");
		if (error) alert(error.message);
		console.log(users);
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

<Menu path="admin/roles" />
<br />
<h1>Admin Portal</h1>

<div style="padding: 10px;">
	<Modal
		bind:isOpen
		modalHeading="Create database"
		primaryButtonText="Confirm"
		secondaryButtonText="Cancel"
		on:click:button--secondary={() => (isOpen = false)}
		on:open
		on:close
		on:submit
	>
		test
	</Modal>
	<Form>
		{#each roles as role}
			<div class="box">
				<FormGroup>
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
					<Button
						kind="tertiary"
						class="button"
						size="small"
						on:click={() => {
							isOpen = true;
							addRoleToUser(role.user_id, role.role);
						}}
						style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
					>
						<p style="font-size: 1.3em;">Update Role</p>
					</Button>
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
