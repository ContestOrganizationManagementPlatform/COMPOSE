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
	import Menu from "$lib/components/Menu.svelte";

	export let originalProblem = null;

	// function that has the payload as argument, runs when submit button is pressed.
	// if not passed in, submit button is not shown
	export let onSubmit = null;

	let topic = originalProblem?.topic ?? "Topic";
	let subTopic = originalProblem?.sub_topics;
	let difficulty = originalProblem?.difficulty;
	let isDisabled = true;
	let problemFailed = false;
	let submittedText = "";

	let fields = {
		problem: originalProblem?.problem_latex ?? "What is $1+1$?",
		comment: originalProblem?.comment_latex ?? "Very cool problem",
		answer: originalProblem?.answer_latex ?? "$2$.",
		solution: originalProblem?.solution_latex ?? "Trivially $\\ans{2}$.",
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

<Form class="editorForm">
	<FormGroup style="display: flex; align-items: end;">
		<Select style="width: 20em; margin-right: 20px;" bind:selected={topic}>
			<SelectItem value="Topic" />
			<SelectItem value="Algebra" />
			<SelectItem value="Combo" />
			<SelectItem value="Number Theory" />
			<SelectItem value="Geometry" />
			<SelectItem value="Mixed" />
		</Select>
		<TextInput
			bind:value={subTopic}
			style="margin-right: 20px;"
			placeholder="Sub-Topic"
			class="textInput"
		/>
		<TextInput
			bind:value={difficulty}
			type="number"
			placeholder="Difficulty"
			class="textInput"
		/>
	</FormGroup>
	<TextArea class="textArea" labelText="Problem" bind:value={fields.problem} />
	<br />
	<TextArea class="textArea" labelText="Comment" bind:value={fields.comment} />
	<br />
	<TextInput class="textInput" labelText="Answer" bind:value={fields.answer} />
	<br />
	<TextArea
		class="textArea"
		labelText="Solution"
		bind:value={fields.solution}
	/>
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

{#if onSubmit}
	<Button
		kind="tertiary"
		class="button"
		size="small"
		disabled={isDisabled || problemFailed}
		on:click={async () => {
			const payload = [
				{
					problem_latex: fields.problem,
					comment_latex: fields.comment,
					answer_latex: fields.answer,
					solution_latex: fields.solution,
					topic: topic,
					sub_topics: subTopic,
					difficulty: parseInt(difficulty),
				},
			];
			submittedText = "Submitting problem...";
			await onSubmit(payload);
			submittedText = "Problem submitted.";
		}}
		style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
	>
		<p>Submit Problem</p>
	</Button>

	<p>{submittedText}</p>
	<br />
{/if}

<style>
	:global(.editorForm) {
		padding: 20px;
	}

	:global(.bx--label) {
		font-weight: 700;
		color: var(--green);
	}
</style>
