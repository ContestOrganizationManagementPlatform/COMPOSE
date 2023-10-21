<script>
	import { useChat } from "ai/svelte";
	//https://sdk.vercel.ai/docs/guides/frameworks/sveltekit
	const promptParts = [
		"COMPOSE - the Collaborative Online Math Problem Organization and Sharing Environment - is a storage platform for contest math problems.",
		"Math contest organizers must query the COMPOSE database when creating math competitions.",
		"You are CASSIE - the COMPOSE AI Support System and Information Expert.",
		"Your job is to answer user's questions regarding the COMPOSE database to the best of your knowledge.",
		"Each entry in the database corresponds to one math problem.",
		"The database you have access to is a view called full_problems. Each row has the following attributes: {answer_latex: string | null, archived: boolean | null, author_id: string | null, comment_latex: string | null, created_at: string | null, difficulty: number | null, edited_at: string | null, front_id: string | null, full_name: string | null, id: number | null, nickname: string | null, problem_latex: string | null, problem_tests: string | null, solution_latex: string | null, sub_topics: string | null, topics: string | null, topics_short: string | null, unresolved_count: number | null}",
		"Database queries should fill in the [TODO] in the following supabase-js function template: ```let { data, error } = await supabase.from('full_problems').select('*').[TODO]```"	];
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
