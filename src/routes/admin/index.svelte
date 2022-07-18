<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import { Button } from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
</script>

<br />
<h1>Admin Portal</h1>
<br />
<Button
	kind="primary"
	class="button"
	size="small"
	type="submit"
	href="/admin/roles"
	style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
>
	<p
		style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
	>
		Roles
	</p>
</Button>
<br />
<br />
<Button
	kind="primary"
	class="button"
	size="small"
	type="submit"
	href="/admin/tests"
	style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
>
	<p
		style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
	>
		Check out tests
	</p>
</Button>
<br />
<br />
<Button
	kind="primary"
	class="button"
	size="small"
	type="submit"
	href="/admin/tournaments"
	style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
>
	<p
		style="margin-left: auto; margin-right: auto; font-size: 1em;font-weight: 500;padding: 0;"
	>
		Check out tournaments
	</p>
</Button>
