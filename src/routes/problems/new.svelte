<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";

	async function submitProblem(payload) {
		const { topics, ...payloadNoTopics } = payload;
		let { data, error } = await supabase
			.from("problems")
			.insert([payloadNoTopics]);
		if (error) alert(error.message);
		console.log(data);
		let { error2 } = await supabase.from("problem_topics").insert(
			payload.topics.map((tp) => ({
				problem_id: data[0].id,
				topic_id: tp,
			}))
		);
	}
</script>

<br />
<h1>Create New Problem</h1>

<ProblemEditor onSubmit={submitProblem} />
