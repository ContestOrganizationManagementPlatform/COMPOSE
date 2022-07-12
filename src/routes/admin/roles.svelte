<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Button,
		TextInput,
		Form,
		FormGroup,
		Select,
		SelectItem,
	} from "carbon-components-svelte";
	const user = supabase.auth.user();
	let loaded = false;
	let isAdmin;
	let roles = [];

	async function roleManager() {
		let { data: users, error } = await supabase
			.from("users")
			.select("id,full_name,user_roles(role)");
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

	(async () => {
		let { data: user_roles, error } = await supabase
			.from("user_roles")
			.select("*")
			.eq("user_id", user.id)
			.gte("role", 40)
			.limit(1);
		if (error) {
			alert(error.message);
		} else {
			if (user_roles.length === 0) {
				isAdmin = false;
			} else {
				isAdmin = true;
				roleManager();
			}
			loaded = true;
		}
	})();

	async function addRoleToUser(user_id, roleNum) {
		let { error } = await supabase.from("user_roles").upsert({
			user_id,
			role: roleNum,
		});
		if (error) alert(error.message);
	}
</script>

{#if !loaded}
	Loading...
{:else if !isAdmin}
	You are not allowed in here!
{:else}
	<Form>
		{#each roles as role}
			<FormGroup>
				<p>ID: {role.user_id}</p>
				<br />
				<p>Name: {role.name}</p>
				<br />
				<Select labelText="Role" bind:selected={role.role}>
					<SelectItem value="0" text="No role assigned (0)" />
					<SelectItem value="10" text="No permissions (10)" />
					<SelectItem value="20" text="Problem Contributor (20)" />
					<SelectItem value="30" text="Problem Writer (30)" />
					<SelectItem value="40" text="Administrator (40)" />
				</Select>
				<Button
					on:click={() => {
						addRoleToUser(role.user_id, role.role);
					}}>Edit</Button
				>
			</FormGroup> <br /> <br />
		{/each}
	</Form>
{/if}
