<script>
	import { supabase } from "$lib/supabaseClient";
	import { TextArea } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";

	const texRegex =
		/\\ques\[(?<topic>\w*)\].*\\begin\{question\}\s*(?<question>.*)\s*\\end\{question\}.*\\begin\{comment\}\s*(?<comment>.*)\s*\\end\{comment\}.*\\begin\{answer\}\s*(?<answer>.*)\s*\\end\{answer\}.*\\begin\{solution\}\s*(?<solution>.*)\s*\\end\{solution\}/s;

	const idMap = {
		Alg: 1,
		Combo: 2,
		Geo: 3,
		NT: 4,
	};

	let files;
	let errorMessages = [];
	let payloads = [];
	let success = false;
	let problemText;

	$: if (files) {
		console.log(files);
		checkFiles();
	}

	async function checkFiles() {
		for (const file of files) {
			const extension = file.name.split(".").pop();
			if (extension !== "tex") {
				errorMessages.push(
					`Skipped file ${file.name} because it is not a .tex file`
				);
			} else {
				const text = await file.text();
				importProblem(text, file.name);
			}
		}

		payloads = payloads;
		errorMessages = errorMessages;
	}

	function manualAdd() {
		if (!importProblem(problemText)) {
			alert("Manual import failed due to improper format");
		} else {
			problemText = "";
		}
	}

	function importProblem(text, name) {
		if (!texRegex.test(text)) {
			if (name) {
				errorMessages.push(
					`Skipped file ${name} because regex failed - check the content`
				);
			}
			return false;
		} else {
			const matches = text.match(texRegex);
			const payload = {
				problem_latex: matches.groups.question,
				comment_latex: matches.groups.comment,
				answer_latex: matches.groups.answer,
				solution_latex: matches.groups.solution,
				topics: [matches.groups.topic],
				sub_topics: "",
				difficulty: 0,
				edited_at: new Date().toISOString(),
			};
			payloads = [...payloads, payload];
			return true;
		}
	}

	async function submitProblems() {
		console.log(payloads);
		success = false;
		let payloadList = [];
		for (const payload of payloads) {
			const { topics, ...payloadNoTopics } = payload;
			payloadList.push(payloadNoTopics);
		}

		let { data, error } = await supabase.from("problems").insert(payloadList);
		if (error) alert(error.message);
		else {
			let topicList = [];

			for (const payload of payloads) {
				const topics = payload.topics;
				// find it in the list
				const foundProblem = data.find((pb) =>
					[
						"problem_latex",
						"comment_latex",
						"answer_latex",
						"solution_latex",
					].every((field) => pb[field] === payload[field])
				); // don't worry about it

				if (!foundProblem) {
					console.log("error: problem submitted but not found");
				} else {
					for (const tp of topics) {
						if (!idMap[tp]) continue;
						topicList.push({
							problem_id: foundProblem.id,
							topic_id: idMap[tp],
						});
					}
				}
			}

			let { error2 } = await supabase.from("problem_topics").insert(topicList);
			if (error2) alert(error2.message);

			const res = await fetch("/api/discord", {
				method: "POST",
				body: JSON.stringify({
					customMessage: true,
					message: `Imported ${payloads.length} problems from text files`,
				}),
			});

			success = true;
		}
	}
</script>

<br />
<h1>Import Problems</h1>
<h3>Please only import your own problems!</h3>

<form on:submit|preventDefault style="padding: 20px;">
	<p>Upload .tex files for the problems:</p>
	<input bind:files multiple type="file" id="picker" />

	<p style="margin-top: 20px;">Or manually add:</p>
	<TextArea
		bind:value={problemText}
		class="textArea"
		style="margin-left: 10%; margin-right: 10%;"
	/>
	<Button action={manualAdd} title="Manually add" />

	<p style="margin-top: 20px;">
		{payloads.length} problems queued to be uploaded
	</p>

	<Button action={submitProblems} title="Import problems" />
</form>

{#if success}
	<p>Successfully imported problems</p>
{/if}

{#if errorMessages.length > 0}
	<p>
		Errors:<br />
		{#each errorMessages as err}
			{err}
		{/each}
	</p>
{/if}
