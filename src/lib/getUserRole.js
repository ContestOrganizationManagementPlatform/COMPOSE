import { supabase } from "$lib/supabaseClient";

// Gets the role of a user given their id.
export async function getUserRole(user_id) {
	let { data: user_roles, error } = await supabase
		.from("user_roles")
		.select("role")
		.eq("user_id", user_id)
		.limit(1);
	if (error) throw error;
	return user_roles.length === 0 ? 0 : user_roles[0].role;
}

// Gets the role of the current user.
export async function getThisUserRole() {
	const user_id = supabase.auth.user().id;
	return await getUserRole(user_id);
}
