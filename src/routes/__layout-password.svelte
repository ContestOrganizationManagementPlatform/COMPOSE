<script>
	import { user } from "$lib/sessionStore";
	import { supabase } from "$lib/supabaseClient";

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});
</script>

<slot />
