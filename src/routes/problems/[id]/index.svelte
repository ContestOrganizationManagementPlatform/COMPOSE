<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { InlineNotification } from "carbon-components-svelte";

	let problem;
	let loaded = false;

	let errorTrue = false;
	let errorMessage = "";

	async function fetchTopic(problem_id) {
		let { data: problem_topics, error } = await supabase
			.from("problem_topics")
			.select("topic_id,global_topics(topic)")
			.eq("problem_id", problem_id);
		problem.topic = problem_topics.map((x) => x.topic_id);
		problem.topicArray = problem_topics.map(
			(x) => x.global_topics?.topic ?? "Unknown Topic"
		);
	}

	async function fetchProblem() {
		let { data: problems, error } = await supabase
			.from("full_problems")
			.select("*")
			.eq("id", $page.params.id)
			.limit(1)
			.single();
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else {
			problem = problems;
			await fetchTopic(problem.id);
			loaded = true;
		}
	}
	fetchProblem();

	async function submitProblem(payload) {
		const { topics, ...payloadNoTopics } = payload;
		let { data, error } = await supabase
			.from("problems")
			.update([payloadNoTopics])
			.eq("id", $page.params.id);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		}
		console.log(data);
		let { error2 } = await supabase
			.from("problem_topics")
			.delete()
			.eq("problem_id", data[0].id);
		let { error3 } = await supabase.from("problem_topics").insert(
			payload.topics.map((tp) => ({
				problem_id: data[0].id,
				topic_id: tp,
			}))
		);
		const res = await fetch("/api/discord", {
			method: "POST",
			body: JSON.stringify(payload),
		});
		fetchProblem();
	}

	async function deleteProblem() {
		const { data, error } = await supabase
			.from("problems")
			.delete()
			.eq("id", problem.id);
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
		} else window.location.replace("/problems");
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

{#if loaded}
	<h1>Problem {problem.id} ({problem.front_id})</h1>
	<br />
	<Button href="/problems" title="Back to Problems" />
	<br /><br />
	<Button href={"/problems/" + problem.id + "/edit"} title="Edit Problem" />
	<br />
	<br />
	<Modal runHeader="Delete Problem" onSubmit={deleteProblem} />
	<br />
	<br />
	<Problem {problem} showMetadata={true} />
{:else}
	<p>Loading problem...</p>
{/if}
