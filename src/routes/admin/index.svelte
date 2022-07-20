<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import Button from "$lib/components/Button.svelte";
	import Banner from "$lib/components/Banner.svelte";
</script>

<br />
<h1>Admin: Portal</h1>
<br />
<Button href="/admin/roles" title="Roles" />
<br />
<br />
<Button href="/admin/tests" title="Check out tests" />
<br />
<br />
<Button href="/admin/tournaments" title="Check out tournaments" />
