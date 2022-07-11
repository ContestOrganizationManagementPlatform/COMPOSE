<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		TextInput,
		Form,
		FormGroup,
		TextArea,
		Button,
	} from "carbon-components-svelte";

	import { displayLatex, checkLatex } from "$lib/latexStuff.js";
	import Problem from "$lib/components/Problem.svelte";

	let topicDropdown;
	let subTopic;
	let difficulty;
	let isDisabled = true;
	let problemFailed = false;

	let fields = {
		problem: "What is $1+1$?",
		comment: "Very cool problem",
		answer: "$2$.",
		solution: "Trivially $\\ans{2}$.",
	};
	let latexes = {
		problem_latex: "",
		comment_latex: "",
		answer_latex: "",
		solution_latex: "",
	};
	let fieldList = ["problem", "comment", "answer", "solution"];
	let errorList = [];
	let doRender = false;

	$: {
		errorList = [];
		let failed = false;
		doRender = false;
		for (const field of fieldList) {
			const fieldErrors = checkLatex(fields[field], field);
			fieldErrors.forEach((x) => (x.field = field));
			errorList.push(...fieldErrors);
			for (const err of fieldErrors) {
				if (err.sev === "err") failed = true;
			}
		}

		if (failed) {
			isDisabled = true;
		} else {
			for (const field of fieldList) {
				latexes[field + "_latex"] = fields[field];
			}
			// force reactivity
			latexes = latexes;

			doRender = true;
			isDisabled = false;
		}
	}
</script>

<h1>Create New Problem</h1>
<Form>
	<FormGroup style="display: flex; margin: 25px; justify-content: start;">
		<Select bind:ref={topicDropdown} style="width: 20em; margin-right: 10px;">
			<SelectItem value="Topic" />
			<SelectItem value="Algebra" />
			<SelectItem value="Combo" />
			<SelectItem value="Number Theory" />
			<SelectItem value="Geometry" />
			<SelectItem value="Mixed" />
		</Select>
		<TextInput
			bind:value={subTopic}
			placeholder="Sub-Topic"
			style="width: 20em;"
		/>
		<TextInput
			bind:value={difficulty}
			type="number"
			placeholder="Difficulty"
			style="width: 20em;"
		/>
	</FormGroup>
	<TextArea labelText="Problem" bind:value={fields.problem} />
	<TextArea labelText="Comment" bind:value={fields.comment} />
	<TextInput labelText="Answer" bind:value={fields.answer} />
	<TextArea labelText="Solution" bind:value={fields.solution} />
</Form>

{#each errorList as err}
	<div style="border: 1px solid black;">
		<p>Error (in {err.field}): {err.error}</p>
		<p>Severity: {err.sev}</p>
	</div>
{/each}

{#if doRender}
	<Problem
		problem={latexes}
		showMetadata={false}
		showLatexErrors={true}
		bind:failed={problemFailed}
	/>
{/if}

<Button
	disabled={isDisabled || problemFailed}
	on:click={async () => {
		const payload = [
			{
				problem_latex: fields.problem,
				comment_latex: fields.comment,
				answer_latex: fields.answer,
				solution_latex: fields.solution,
				topic: topicDropdown.value,
				sub_topics: subTopic,
				difficulty: parseInt(difficulty),
			},
		];
		console.log(payload);
		const { data, error } = await supabase.from("problems").insert(payload);
		if (error) alert(error.message);
	}}>Submit Problem</Button
>
