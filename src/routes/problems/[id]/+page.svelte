<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import ProblemFeedback from "$lib/components/ProblemFeedback.svelte";
	import { getThisUserRole } from "$lib/getUserRole";
	import { getSingleProblem } from "$lib/getProblems";
	import toast from "svelte-french-toast";

	let problem;
	let loaded = false;

	let isAdmin = false;

	async function getAuthorName() {
		let { data: user, error } = await supabase
			.from("users")
			.select("full_name")
			.eq("id", supabase.auth.user().id)
			.single();
		if (error) toast.error(error.message);
		else return user.full_name;
	}

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
		isAdmin = (await getThisUserRole()) >= 40;
		problem = await getSingleProblem({
			id: $page.params.id,
			archived: isAdmin,
		});

		if (!problem) {
			// problem wasn't found
			loaded = true;
			return;
		}

		await fetchTopic(problem.id);
		loaded = true;
	}
	fetchProblem();

	async function deleteProblem() {
		const { data, error } = await supabase
			.from("problems")
			.update({ archived: true })
			.eq("id", problem.id);
		if (error) {
			toast.error(error.message);
		} else {
			const authorName = await getAuthorName();
			await fetch("/api/discord-update", {
				method: "POST",
				body: JSON.stringify({
					id: problem.id,
					update: "deleted",
					updater: authorName,
				}),
			});

			window.location.replace("/problems");
		}
	}

	async function restoreProblem() {
		const { data, error } = await supabase
			.from("problems")
			.update({ archived: false })
			.eq("id", problem.id);

		window.location.reload();
	}
</script>

<br />

{#if loaded}
	{#if problem}
		<h1>Problem {problem.id} ({problem.front_id})</h1>
		<br />
		<Button href="/problems" title="Back to Problems" />
		<br /><br />
		<Button href={"/problems/" + problem.id + "/edit"} title="Edit Problem" />
		<br />
		<br />
		{#if problem.archived && isAdmin}
			<Modal runHeader="Restore Problem" onSubmit={restoreProblem} />
			<br />
			<br />
		{:else if problem.author_id === supabase.auth.user().id || isAdmin}
			<Modal runHeader="Delete Problem" onSubmit={deleteProblem} />
			<br />
			<br />
		{/if}
		<Problem {problem} showMetadata={true} />
		<br />
		<br />
		<ProblemFeedback problemID={$page.params.id} />
	{:else}
		<h1>Problem not found!</h1>
	{/if}
{:else}
	<p>Loading problem...</p>
{/if}
