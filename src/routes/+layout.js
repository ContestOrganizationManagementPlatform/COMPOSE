import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";

export const load = async ({ fetch, data, depends }) => {
	depends("supabase:auth");

	const supabase = createSupabaseLoadClient({
		supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
		supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return { supabase, session };
};
