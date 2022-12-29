<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let errorTrue = false;
	let errorMessage = "";
	let authorName = "";

	async function getAuthorName() {
		let { data: user, error } = await supabase
			.from("users")
			.select("full_name")
			.eq("id", supabase.auth.user().id)
			.single();
		if (error) throw error;
		else authorName = user.full_name;
	}

	async function getFrontID(id) {
		let { data, error } = await supabase
			.from("front_ids")
			.select("front_id")
			.eq("problem_id", id)
			.single();
		if (error) throw error;
		else return data.front_id;
	}

	async function submitProblem(payload) {
		if (authorName === "") {
			alert("Please wait for author name to finish loading");
		} else {
			const { topics, problem_files, ...payloadNoTopics } = payload;
			let { data, error } = await supabase
				.from("problems")
				.insert([payloadNoTopics]);
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			}

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
					.upload(`pb${problemId}/problem/${file.name}`, file, {
						upsert: true,
					});
			}

			const res = await fetch("/api/discord", {
				method: "POST",
				body: JSON.stringify({
					problem: payload,
					authorName,
					id: problemId,
					created_at: data[0].created_at,
					front_id: await getFrontID(problemId),
				}), // don't question it
			});

			window.location.replace(`/problems/${problemId}`);
		}
	}

	getAuthorName();
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
