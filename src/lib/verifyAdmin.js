
import { supabase }

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
