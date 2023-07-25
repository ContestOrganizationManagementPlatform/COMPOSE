import { supabase } from "../supabaseClient";

/**
 * Gets author name from id
 *
 * @param author_id number
 * @returns author name
 */
export async function getAuthorName(author_id: string) {
	let { data: user, error } = await supabase
		.from("users")
		.select("full_name")
		.eq("id", author_id)
		.single();
	if (error) throw error;
	return user.full_name;
}

/**
 * Returns user role number given a uuid
 *
 * @param user_id uuid
 * @returns user role, number
 */
export async function getUserRole(user_id) {
	let { data: user_roles, error } = await supabase
		.from("user_roles")
		.select("role")
		.eq("user_id", user_id)
		.limit(1);
	if (error) throw error;
	return user_roles.length === 0 ? 0 : user_roles[0].role;
}

/**
 * Returns current user's role number
 *
 * @returns current user's role, number
 */
export async function getThisUserRole() {
	const user_id = supabase.auth.user().id;
	return await getUserRole(user_id);
}
