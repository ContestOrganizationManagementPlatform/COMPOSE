<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import Menu from "$lib/components/Menu.svelte";

	async function submitProblem(payload) {
		let { error } = await supabase.from("problems").insert(payload, {
			returning: "minimal",
		});
		if (error) alert(error);
	}
</script>

<Menu path="new-problem" />
<br />
<h1>Create New Problem</h1>

<ProblemEditor onSubmit={submitProblem} />
