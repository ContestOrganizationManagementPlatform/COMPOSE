<script>
	import { supabase } from "$lib/supabaseClient";
	import "carbon-components-svelte/css/white.css";
	import { Button } from "carbon-components-svelte";
	import Banner from "$lib/components/Banner.svelte";
	import Menu from "$lib/components/Menu.svelte";
</script>

<Menu path="admin" />
<h1>Admin Portal</h1>
<Button href="/admin/roles">Roles</Button>
<br />
<br />
<Button href="/admin/tests">Check out tests</Button>
<br />
<br />
<Button href="/admin/tournament">Check out tournaments</Button>
