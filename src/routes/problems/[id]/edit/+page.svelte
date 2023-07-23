<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import { getProblemImages } from "$lib/getProblemImages";
	import Problem from "$lib/components/Problem.svelte";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import Button from "$lib/components/Button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import toast from "svelte-french-toast";
	import { getSingleProblem } from "$lib/getProblems";

	let problem;
	let images = [];
	let loaded = false;

	async function getAuthorName() {
		try {
			let { data: user, error } = await supabase
				.from("users")
				.select("full_name")
				.eq("id", supabase.auth.user().id)
				.single();
			if (error) throw error;
			else return user.full_name;
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function fetchTopic(problem_id) {
		try {
			let { data: problem_topics, error } = await supabase
				.from("problem_topics")
				.select("topic_id,global_topics(topic)")
				.eq("problem_id", problem_id);
			if (error) throw error;

			problem.topic = problem_topics.map((x) => x.topic_id);
			problem.topicArray = problem_topics.map(
				(x) => x.global_topics?.topic ?? "Unknown Topic"
			);
		} catch (error) {
			toast.error(error.message);
		}
	}

	async function fetchProblem() {
		try {
			problem = await getSingleProblem({
				id: $page.params.id,
			});
			await fetchTopic(problem.id);
			images = await getProblemImages(supabase, problem.id);
			loaded = true;
		} catch (error) {
			toast.error(error.message);
		}
	}

	fetchProblem();

	async function submitProblem(payload) {
		try {
			const { topics, problem_files, ...payloadNoTopics } = payload;
			let { data, error } = await supabase
				.from("problems")
				.update([payloadNoTopics])
				.eq("id", $page.params.id);
			if (error) throw error;

			let { error2 } = await supabase
				.from("problem_topics")
				.delete()
				.eq("problem_id", data[0].id);
			if (error2) throw error2;

			let { error3 } = await supabase.from("problem_topics").insert(
				payload.topics.map((tp) => ({
					problem_id: data[0].id,
					topic_id: tp,
				}))
			);
			if (error3) throw error3;

			// delete all files already in the problem
			const { data: fileList, error4 } = await supabase.storage
				.from("problem-images")
				.list(`pb${problem.id}/problem`);
			if (error4) throw error4;

			if (fileList.length > 0) {
				const { error5 } = await supabase.storage
					.from("problem-images")
					.remove(fileList.map((f) => `pb${problem.id}/problem/${f.name}`));
				if (error5) throw error5;
			}

			for (const file of problem_files) {
				let { error3 } = await supabase.storage
					.from("problem-images")
					.upload(`pb${problem.id}/problem/${file.name}`, file, {
						upsert: true,
					});
				if (error3) throw error3;
			}

			const authorName = await getAuthorName();
			await fetch("/api/discord-update", {
				method: "POST",
				body: JSON.stringify({
					id: problem.id,
					update: "edited",
					updater: authorName,
				}),
			});

			fetchProblem();
		} catch (error) {
			toast.error(error.message);
		}
	}
</script>

<br />

{#if loaded}
	<h1>Problem {problem.id} ({problem.front_id})</h1>
	<br />
	<Button href="/problems" title="Back to Problems" />
	<br /><br />
	<Button href={"/problems/" + problem.id} title="Return" />
	<ProblemEditor
		originalProblem={problem}
		originalImages={images}
		onSubmit={submitProblem}
	/>
{:else}
	<p>Loading problem...</p>
{/if}
