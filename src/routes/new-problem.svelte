<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";

	async function submitProblem(payload) {
		let { error } = await supabase.from("problems").insert(payload, {
			returning: "minimal",
		});
		if (error) alert(error);
	}
</script>

<br />
<h1>Create New Problem</h1>

<ProblemEditor onSubmit={submitProblem} />
