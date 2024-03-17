<script lang="ts">
	import { page } from "$app/stores";
	import Problem from "$lib/components/Problem.svelte";
	import Button from "$lib/components/Button.svelte";
	import ModalButton from "$lib/components/ModalButton.svelte";
	import ProblemFeedback from "$lib/components/ProblemFeedback.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		getAuthorName,
		archiveProblem,
		restoreProblem,
		getThisUser,
		getProblemTopics,
		getProblem,
		getThisUserRole,
	} from "$lib/supabase";

	let problem;
	let loaded = false;
	let isAdmin = false;
	let user;

	(async () => {
		user = await getThisUser();
	})();

	async function fetchTopic(problem_id) {
		try {
			const problem_topics = await getProblemTopics(
				problem_id,
				"topic_id,global_topics(topic)"
			);
			problem.topic = problem_topics.map((x) => x.topic_id);
			problem.topicArray = problem_topics.map(
				(x) => x.global_topics?.topic ?? "Unknown Topic"
			);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function fetchProblem() {
		try {
			isAdmin = (await getThisUserRole()) >= 40;
			problem = await getProblem(Number($page.params.id));

			if (!problem) {
				// problem wasn't found
				loaded = true;
				return;
			}

			await fetchTopic(problem.id);
			loaded = true;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}
	fetchProblem();

	async function deleteProblem() {
		try {
			await archiveProblem(problem.id);

			/**
			    const authorName = await getAuthorName(user.id);
				await fetch("/api/discord-update", {
					method: "POST",
					body: JSON.stringify({
						id: problem.id,
						update: "deleted",
						updater: authorName,
					}),
				});
			*/
			window.location.replace("/problems");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function restoreLocalProblem() {
		try {
			await restoreProblem(problem.id);
			window.location.reload();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
			<ModalButton runHeader="Restore Problem" onSubmit={restoreLocalProblem} />
			<br />
			<br />
		{:else if problem.author_id === user.id || isAdmin}
			<ModalButton runHeader="Archive Problem" onSubmit={deleteProblem} />
			<br />
			<br />
		{/if}
		<Problem {problem} showMetadata={true} />
		<br />
		<br />
		<ProblemFeedback problem_id={problem.id} solver_id={user.id} />
	{:else}
		<h1>Problem not found!</h1>
	{/if}
{:else}
	<p>Loading problem...</p>
{/if}
