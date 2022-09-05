<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let errorTrue = false;
	let errorMessage = "";

	async function submitProblem(payload) {
		const { topics, ...payloadNoTopics } = payload;
		let { data, error } = await supabase
			.from("problems")
			.insert([payloadNoTopics]);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		console.log(data);
		let { error2 } = await supabase.from("problem_topics").insert(
			payload.topics.map((tp) => ({
				problem_id: data[0].id,
				topic_id: tp,
			}))
		);
		const res = await fetch("/api/discord", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}
</script>

<br />

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

<h1>Create New Problem</h1>

<ProblemEditor onSubmit={submitProblem} />
