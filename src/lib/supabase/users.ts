import { supabase } from "../supabaseClient";

/**
 * Gets author name from id
 *
 * @param author_id uuid
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
export async function getUserRole(user_id: string) {
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

/**
 * Returns current user's info
 *
 * @returns current user info
 */
export function getThisUser() {
	return supabase.auth.user();
}

/**
 * Takes in a user_id as a parameter, outputs the user info
 * Role number is in .role, not .user_roles.role
 *
 * @param user_id uuid
 * @returns user object with role number
 */
export async function getUser(user_id: string) {
	let { data: user, error } = await supabase
		.from("users")
		.select("*,user_roles(role)")
		.eq("id", user_id)
		.single();
	if (error) throw error;
	let final_user = {};
	for (const key of Object.keys(user)) {
		if (key !== "user_roles") {
			final_user[key] = user[key];
		}
	}
	final_user["role"] = user.user_roles?.role ?? 0;
	return final_user;
}

/**
 * Fetches all users from database
 *
 * @param customSelect optional, string
 * @returns all users
 */
export async function getAllUsers(customSelect = "*") {
	let { data: users, error } = await supabase
		.from("users")
		.select(customSelect);
	if (error) throw error;
	return users;
}

/**
 * Allows you to apply a custom order to fetching users
 *
 * @param customOrder string
 * @param customSelect optional, string
 * @returns users from database sorted by order
 */
export async function getAllUsersOrder(
	customOrder: string,
	customSelect = "*"
) {
	let { data: users, error } = await supabase
		.from("users")
		.select(customSelect)
		.order(customOrder);
	if (error) throw error;
	return users;
}

/**
 * Updates a user given their user id and role. Returns nothing.
 *
 * @param user_id string
 * @param role number
 */
export async function updateUserRole(user_id: string, role: number) {
	if (role === 0) {
		let { error } = await supabase
			.from("user_roles")
			.delete()
			.eq("user_id", user_id);
		if (error) throw error;
	} else {
		const { error } = await supabase
			.from("user_roles")
			.update({ role })
			.eq("user_id", user_id);
		if (error) throw error;
	}
}
