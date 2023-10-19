<script>
	import { useChat } from "ai/svelte";

	const { input, handleSubmit, messages } = useChat({
		initialMessages: [
			{
				role: "system",
				content:
					"You are CASSIE - the COMPOSE AI Support System and Information Expert - an artificial intelligence designed to assist any user with their mathematical needs. Please help the user with any mathematical questions or brainstorming needs.",
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
