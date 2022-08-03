<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		MultiSelect,
		TextInput,
		Form,
		FormGroup,
		TextArea,
		Button,
	} from "carbon-components-svelte";

	import { displayLatex, checkLatex } from "$lib/latexStuff.js";
	import Problem from "$lib/components/Problem.svelte";
	import Menu from "$lib/components/Menu.svelte";
	import LatexKeyboard from "$lib/components/editor/LatexKeyboard.svelte";
	import KeyboardButton from "$lib/components/editor/KeyboardButton.svelte";

	export let originalProblem = null;

	// function that has the payload as argument, runs when submit button is pressed.
	// if not passed in, submit button is not shown
	export let onSubmit = null;
	let loading = true;
	console.log(originalProblem);

	let topics = originalProblem?.topic ?? []; // This will be a list of integer topic ids
	let all_topics = []; // [{id: 1, text: "Algebra"}]
	let subTopic = originalProblem?.sub_topics;
	let difficulty = originalProblem?.difficulty;
	let isDisabled = true;
	let problemFailed = false;
	let submittedText = "";
	let error = "";

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

	async function getTopics() {
		loading = true;
		let { data: global_topics, error } = await supabase
			.from("global_topics")
			.select("*");
		if (error) alert(error.message);
		all_topics = [];
		for (const single_topic of global_topics) {
			all_topics.push({ id: single_topic.id, text: single_topic.topic });
		}
		loading = false;
	}
	getTopics();
</script>

{#if loading}
	<p>Loading problem editor...</p>
{:else}
	<div class="row" style="grid-template-columns: 70% 30%;">
		<div class="col">
			<Form class="editorForm">
				<FormGroup style="display: flex; align-items: end;">
					<MultiSelect
						filterable
						style="width: 20em; margin-right: 20px;"
						bind:selectedIds={topics}
						bind:items={all_topics}
						required={true}
					/>
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
						required={true}
					/>
				</FormGroup>
				<TextArea
					class="textArea"
					labelText="Problem"
					bind:value={fields.problem}
					required={true}
				/>
				<br />
				<TextArea
					class="textArea"
					labelText="Comment"
					bind:value={fields.comment}
					required={true}
				/>
				<br />
				<TextInput
					class="textInput"
					labelText="Answer"
					bind:value={fields.answer}
					required={true}
				/>
				<br />
				<TextArea
					class="textArea"
					labelText="Solution"
					bind:value={fields.solution}
					required={true}
				/>
			</Form>
		</div>

		<div class="col">
			<br />
			<br />
			{#if onSubmit}
				<Button
					kind="tertiary"
					class="button"
					type="submit"
					size="small"
					disabled={isDisabled || problemFailed}
					on:click={async () => {
						if (
							fields.problem != null &&
							fields.problem != "" &&
							fields.comment != null &&
							fields.comment != "" &&
							fields.answer != null &&
							fields.answer != "" &&
							fields.solution != null &&
							fields.solution != "" &&
							topics &&
							difficulty != null &&
							difficulty != ""
						) {
							error = "";
							const payload = {
								problem_latex: fields.problem,
								comment_latex: fields.comment,
								answer_latex: fields.answer,
								solution_latex: fields.solution,
								topics: topics,
								sub_topics: subTopic,
								difficulty: parseInt(difficulty),
								edited_at: new Date().toISOString(),
							};
							submittedText = "Submitting problem...";
							await onSubmit(payload);
							submittedText = "Problem submitted.";
						} else {
							error = "Not all the fields have been filled out";
						}
					}}
					style="width: 30em; border-radius: 2.5em; margin: 0; padding: 0;"
				>
					<p>Submit Problem</p>
				</Button>

				<p>{submittedText}</p>
				<br />
			{/if}
			{#each errorList as err}
				<div style="border: 1px solid black;">
					<p>Error (in {err.field}): {err.error}</p>
					<p>Severity: {err.sev}</p>
				</div>
			{/each}

			<p style="color: red">{error != "" ? "Error: " + error : ""}</p>

			{#if doRender}
				<Problem
					problem={latexes}
					showMetadata={false}
					showLatexErrors={true}
					widthPara={100}
					bind:failed={problemFailed}
				/>
			{/if}
		</div>
	</div>

	<LatexKeyboard
		onClick={() => {
			fields = fields;
		}}
	/>
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
