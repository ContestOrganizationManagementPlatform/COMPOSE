<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		MultiSelect,
		TextInput,
		Form,
		FormGroup,
		TextArea,
		Button,
		FileUploader,
		FileUploaderItem,
	} from "carbon-components-svelte";

	import { displayLatex, checkLatex } from "$lib/latexStuff.js";
	import { ProblemImage } from "$lib/getProblemImages";
	import Problem from "$lib/components/Problem.svelte";
	import LatexKeyboard from "$lib/components/editor/LatexKeyboard.svelte";
	import ImageManager from "$lib/components/images/ImageManager.svelte";

	export let originalProblem = null;
	export let originalImages = [];

	// function that has the payload as argument, runs when submit button is pressed.
	// if not passed in, submit button is not shown
	export let onSubmit = null;
	let loading = true;

	let topics = originalProblem?.topic ?? []; // This will be a list of integer topic ids
	let all_topics = []; // [{id: 1, text: "Algebra"}]
	let topicsStr = "Select a topic...";
	$: if (topics.length > 0 && all_topics.length > 0) {
		topicsStr = topics
			.map((x) => all_topics?.find((at) => at.id === x)?.text_short)
			.join(", ");
	} else {
		topicsStr = "Select a topic...";
	}

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
	let fieldrefs = {
		problem: null,
		comment: null,
		answer: null,
		solution: null,
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

	const fileUploadLimit = 5; // # of files that can be uploaded
	const fileSizeLimit = 52428800; // 50 mb
	let fileUploader;
	let problemFiles = originalImages.map((x) => x.toFile());
	let problemImages = [];
	$: problemImages = problemFiles.map((x) => ProblemImage.fromFile(x));

	let activeTextarea = null;
	function updateActive() {
		for (const field of fieldList) {
			if (document.activeElement === fieldrefs[field]) {
				activeTextarea = field;
				return;
			}
		}
		activeTextarea = null;
	}

	function updateFields() {
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
	updateFields();

	async function getTopics() {
		loading = true;
		let { data: global_topics, error } = await supabase
			.from("global_topics")
			.select("*");
		if (error) alert(error.message);
		all_topics = [];
		for (const single_topic of global_topics) {
			all_topics.push({
				id: single_topic.id,
				text: single_topic.topic,
				text_short: single_topic.topic_short,
			});
		}
		all_topics = all_topics;
		topics = topics;
		loading = false;
	}
	getTopics();

	async function submitPayload() {
		if (
			fields.problem &&
			fields.comment &&
			fields.answer &&
			fields.solution &&
			topics &&
			difficulty
		) {
			if (problemFiles.length > fileUploadLimit) {
				error = "Too many files uploaded";
			} else if (problemFiles.some((f) => f.size > fileSizeLimit)) {
				error = "File too large";
			} else {
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
					problem_files: problemFiles,
				};
				submittedText = "Submitting problem...";
				await onSubmit(payload);
				submittedText = "Problem submitted.";
			}
		} else {
			error = "Not all the fields have been filled out";
		}
	}
</script>

<svelte:window on:click={updateActive} />

{#if loading}
	<p>Loading problem editor...</p>
{:else}
	<div class="row editorContainer" style="grid-template-columns: 70% 30%;">
		<div class="col">
			<Form class="editorForm">
				<FormGroup style="display: flex; align-items: end;">
					<MultiSelect
						style="width: 20em; margin-right: 20px"
						bind:selectedIds={topics}
						items={all_topics}
						label={topicsStr}
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
					bind:ref={fieldrefs.problem}
					on:input={updateFields}
					required={true}
				/>
				{#if activeTextarea === "problem"}
					<div class="stickyKeyboard">
						<LatexKeyboard />
					</div>
				{/if}
				<br />

				<TextInput
					class="textInput"
					labelText="Answer"
					bind:value={fields.answer}
					bind:ref={fieldrefs.answer}
					on:input={updateFields}
					required={true}
				/>
				{#if activeTextarea === "answer"}
					<div class="stickyKeyboard">
						<LatexKeyboard />
					</div>
				{/if}
				<br />
				<TextArea
					class="textArea"
					labelText="Solution"
					bind:value={fields.solution}
					bind:ref={fieldrefs.solution}
					on:input={updateFields}
					required={true}
				/>
				{#if activeTextarea === "solution"}
					<div class="stickyKeyboard">
						<LatexKeyboard />
					</div>
				{/if}
				<br />
				<TextArea
					class="textArea"
					labelText="Comments"
					bind:value={fields.comment}
					bind:ref={fieldrefs.comment}
					on:input={updateFields}
					required={true}
				/>
				{#if activeTextarea === "comment"}
					<div class="stickyKeyboard">
						<LatexKeyboard />
					</div>
				{/if}

				<ImageManager />
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
					on:click={submitPayload}
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
{/if}

<style>
	:global(.editorForm) {
		padding: 20px;
	}

	:global(.bx--label) {
		font-weight: 700;
		color: var(--green);
	}

	:global(.bx--multi-select__wrapper) {
		width: 20em;
		margin-right: 20px;
	}

	:global(.bx--text-area),
	:global(.bx--list-box__field),
	:global(.bx--checkbox-label-text),
	:global(.textInput),
	:global(.bx--modal-header h3),
	:global(.bx--modal-content),
	:global(.bx--text-input),
	:global(.bx--text-input::placeholder) {
		font-family: "Ubuntu", "Roboto", Arial, -apple-system, BlinkMacSystemFont,
			"Segoe UI", Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	:global(.bx--file--label) {
		color: var(--green) !important;
	}

	:global(.bx--list-box__field:focus) {
		outline-color: var(--green) !important;
	}

	:global(.bx--text-area:focus) {
		border-color: var(--green) !important;
		outline-color: var(--green) !important;
	}

	:global(#button .bx--btn--primary),
	:global(#button .bx--btn--primary:focus) {
		border-color: transparent !important;
		background-color: var(--green) !important;
	}
	:global(#button .bx--btn--primary p) {
		color: var(--body) !important;
	}
	:global(#button .bx--btn--primary:hover) {
		background-color: var(--body) !important;
	}
	:global(#button .bx--btn--primary:hover p) {
		color: var(--white) !important;
	}
	:global(#button .bx--btn--primary:focus) {
		border-color: var(--body) !important;
		outline: none !important;
		box-shadow: none !important;
	}

	:global(#button .bx--btn--primary span) {
		margin-left: 50px;
		width: 100%;
		margin-right: auto;
		font-size: 15px;
		padding: 0;
	}
</style>
