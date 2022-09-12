<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let errorTrue = false;
	let errorMessage = "";

	async function submitProblem(payload) {
		const { topics, problem_files, ...payloadNoTopics } = payload;
		let { data, error } = await supabase
			.from("problems")
			.insert([payloadNoTopics]);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		console.log(data);

		let problemId = data[0].id;

		let { error2 } = await supabase.from("problem_topics").insert(
			payload.topics.map((tp) => ({
				problem_id: problemId,
				topic_id: tp,
			}))
		);

		for (const file of problem_files) {
			let { error3 } = await supabase.storage
				.from("problem-images")
				.upload(`pb${problemId}/problem/${file.name}`, file, { upsert: true });
		}

		const res = await fetch("/api/discord", {
			method: "POST",
			body: JSON.stringify(payload),
		});

		window.location.replace(`/problems/${problemId}`);
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
