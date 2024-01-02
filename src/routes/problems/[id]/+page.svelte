<script lang="ts">
	import { page } from "$app/stores";
	import Problem from "$lib/components/Problem.svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import ProblemFeedback from "$lib/components/ProblemFeedback.svelte";
	import toast from "svelte-french-toast";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
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

	let feedbackList = [
		{
			id: 1,
			user: "Amy Beach",
			feedback: "Stupid problem.",
			answer: "c♯",
			difficulty: 9,
			quality: 1,
		},

		{
			id: 2,
			user: "Ludwig van Beethoven",
			feedback: "Nice start!",
			answer: "C",
			difficulty: 1,
			quality: 2,
		},
		{
			id: 3,
			user: "Peter Ilyich Tchaikovsky",
			feedback: "Pretty terrible, sorry.",
			answer: "e",
			difficulty: 9,
			quality: 5,
		},
		{
			id: 4,
			user: "Gustav Mahler",
			feedback: "nope.",
			answer: "a",
			difficulty: 2,
			quality: 2,
		},
		{
			id: 5,
			user: "Anton Bruckner",
			feedback: "Good job!",
			answer: "C",
			difficulty: 1,
			quality: 5,
		},
	];

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

			const authorName = await getAuthorName(getThisUser().id);
			await fetch("/api/discord-update", {
				method: "POST",
				body: JSON.stringify({
					id: problem.id,
					update: "deleted",
					updater: authorName,
				}),
			});

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
	{#if problem.id === 168}
		<h1>Li'l Symph</h1>
		<br />
		<em>How did these guys COMPOSE some of their largest works?</em>

		<br /><br />
		<h2>Problem Data</h2>
		<div class="flex">
			<div
				style="border: 2px solid black;width: {70}%;margin: 10px;padding: 10px;"
			>
				<p class="header">Problem</p>
				<p id="problem-render">
					You're on the circle of fifths, and you take three steps clockwise.
					Where do you end up?
				</p>
				<p class="header">Answer</p>
				<p id="answer-render">?</p>
				<p class="header">Solution</p>
				<p id="solution-render">Depends on where you started.</p>
				<br />
			</div>
		</div>
		<br />
		<br />
		<div class="flex">
			<div class="feedback-container">
				<h2>Feedback</h2>
				<DataTable
					size="compact"
					headers={[
						{ key: "user", value: "User" },
						{ key: "feedback", value: "Feedback" },
						{ key: "answer", value: "Answer" },
						{ key: "difficulty", value: "Difficulty" },
						{ key: "quality", value: "Quality" },
					]}
					rows={feedbackList}
				>
					<svelte:fragment slot="cell" let:row let:cell let:rowIndex>
						<div>
							<div style="overflow: hidden;">
								{cell.value}
							</div>
						</div>
					</svelte:fragment>
				</DataTable>
			</div>
		</div>
		<br />
		<br />
		<Button href="/problems" title="Back to Problems" />
	{:else if problem}
		<h1>Problem {problem.id} ({problem.front_id})</h1>
		<br />
		<Button href="/problems" title="Back to Problems" />
		<br /><br />
		<Button href={"/problems/" + problem.id + "/edit"} title="Edit Problem" />
		<br />
		<br />
		{#if problem.archived && isAdmin}
			<Modal runHeader="Restore Problem" onSubmit={restoreLocalProblem} />
			<br />
			<br />
		{:else if problem.author_id === getThisUser().id || isAdmin}
			<Modal runHeader="Archive Problem" onSubmit={deleteProblem} />
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

<style>
	.header {
		font-weight: 700;
	}

	.feedback-container {
		width: 70%;
		align-items: center;
		justify-content: center;
	}
</style>
