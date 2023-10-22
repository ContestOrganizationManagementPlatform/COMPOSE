<script>
	import { useChat } from "ai/svelte";
	import { get } from "svelte/store";
	import { supabase } from "$lib/supabaseClient";
	import ProblemList from "$lib/components/ProblemList.svelte";
	//import { supabase } from "$lib/src/supabaseClient";
	//https://sdk.vercel.ai/docs/guides/frameworks/sveltekit
	const promptParts = [
		"COMPOSE - the Collaborative Online Math Problem Organization and Sharing Environment - is a storage platform for contest math problems.",
		"Math contest organizers must query the COMPOSE database when creating math competitions.",
		"You are CASSIE - the COMPOSE AI Support System and Information Expert.",
		"Your job is to answer user's questions regarding the COMPOSE database to the best of your knowledge.",
		"Each entry in the database corresponds to one math problem.",
		"The database you have access to is a view called full_problems. Each row has the following attributes: {answer_latex: string | null, archived: boolean | null, author_id: string | null, comment_latex: string | null, created_at: string | null, difficulty: number | null, edited_at: string | null, front_id: string | null, full_name: string | null, id: number | null, nickname: string | null, problem_latex: string | null, problem_tests: string | null, solution_latex: string | null, sub_topics: string | null, topics: string | null, topics_short: string | null, unresolved_count: number | null}",
		"Database queries should fill in the [TODO] in the following supabase-js function template: ```javascript await supabase.from('full_problems').select('*').[TODO]```",
	];

	const { input, handleSubmit, messages, isLoading } = useChat({
		initialMessages: [
			{
				role: "system",
				content: promptParts.join(" "),
			},
		],
		onFinish: submitWrapper,
	});

	let problems = [];

	function submitWrapper() {
		const allMessages = get(messages);
		const curMessage = allMessages[allMessages.length - 1];
		console.log(curMessage);
		if (
			(curMessage.role =
				"assistant" && curMessage.content.includes("await supabase"))
		) {
			console.log(curMessage.content);
			const regex = /```javascript(.*?)```/s;
			const match = curMessage.content.match(regex);
			console.log(match);

			if (match) {
				let codeBlock = match[1].trim();
				console.log("CODE", codeBlock);
				//codeBlock = codeBlock.replaceAll(/(\r\n|\n|\r)/gm, "");
				//console.log("CODE", codeBlock);
				console.log("Created");
				/*
				(async () => {
					const { data } = await supabase
						.from("full_problems")
						.select("*")
						.gt("difficulty", 3)
						.order("difficulty", { ascending: false });
					console.log(data);
				})();
                */
				const asyncFunction = new Function(
					"supabase",
					`
                    return (async () => {
                        const { data } = ${codeBlock}
                        console.log(data);
                        console.log("finish")
                        return data;
                    })();
                    `
				);
				console.log("AAHAHHAHHAH");
				try {
					const result = asyncFunction(supabase)
						.then((result) => {
							console.log("R", result);
							problems = result;
							console.log("Async code execution completed.");
						})
						.catch((error) => {
							console.error("Async code execution error:", error);
						});
					console.log("Code executed successfully. Result:", result);
				} catch (error) {
					console.error("Error executing code:", error);
				}
			} else {
				console.log("No code block found.");
			}
		} else {
			console.log("Not a function");
		}
	}

	const query = "";
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

	<div style="width:80%; margin: auto;margin-bottom: 20px;">
		<ProblemList {problems} />
	</div>
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
