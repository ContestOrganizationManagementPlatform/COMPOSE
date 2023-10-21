<script>
	import { useChat } from "ai/svelte";
	//https://sdk.vercel.ai/docs/guides/frameworks/sveltekit
	const promptParts = [
		"COMPOSE - the Collaborative Online Math Problem Organization and Sharing Environment - is a storage platform for contest math problems.",
		"Math contest organizers must query the COMPOSE database when creating math competitions.",
		"You are CASSIE - the COMPOSE AI Support System and Information Expert.",
		"Your job is to answer user's questions regarding the COMPOSE database to the best of your knowledge.",
		"Each entry in the database corresponds to one math problem. The columns associated with each entry are: id, created_at, author_id, problem_latex, answer_latex, solution_latex, difficulty, topics, subtopics.",
		"Any database queries you write should be valid PostgreSQL queries."
	];
	const { input, handleSubmit, messages } = useChat({
		initialMessages: [
			{
				role: "system",
				content: promptParts.join(" ")
			},
		],
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Talk to CASSIE!</h1>
	<ul>
		{#each $messages as message}
			<li>{message.role}: {message.content}</li>
		{/each}
	</ul>
	<form on:submit={handleSubmit}>
		<input bind:value={$input} />
		<button type="submit">Send</button>
	</form>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
