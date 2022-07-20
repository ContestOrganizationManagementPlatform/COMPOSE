<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";

	let problem;
	let loaded = false;
	let editing = false;

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
			.from("problems")
			.select("*")
			.eq("id", $page.params.id)
			.limit(1)
			.single();
		if (error) {
			alert(error.message);
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
		if (error) alert(error.message);
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
		fetchProblem();
	}
</script>

<br />
{#if loaded}
	<h1>Problem {problem.id}</h1>
	<br />
	<Button href="/problems" title="Back to Problems" />
	<br /><br />
	{#if editing}
		<Button
			action={() => {
				editing = false;
			}}
			title="Return"
		/>
		<ProblemEditor originalProblem={problem} onSubmit={submitProblem} />
	{:else}
		<Button
			action={() => {
				editing = true;
			}}
			title="Edit Problem"
		/>
		<br />
		<br />
		<Modal
			runHeader="Delete Problem"
			onSubmit={() => {
				console.log("test");
			}}
		/>
		<br />
		<br />
		<Problem {problem} showMetadata={true} />
	{/if}
{:else}
	<p>Loading problem...</p>
{/if}
