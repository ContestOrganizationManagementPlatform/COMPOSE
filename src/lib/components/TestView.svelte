<script lang="ts">
	import Latex from "$lib/components/Latex.svelte";
	import { Checkbox, TextArea, TextInput } from "carbon-components-svelte";
	import { TestsolveAnswer } from "$lib/TestsolveAnswer";
	import { createEventDispatcher } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import { getTestProblems } from "$lib/supabase";

	const dispatch = createEventDispatcher();

	export let testId;
	export let reviewing = false;
	export let answerable = false;
	export let submittable = false;
	export let answers = [];
	export let feedbackAnswers = [];
	export let feedbackQuestions = {};

	let problems = [];
	let answerTexts = {};
	let isCorrect = {};
	let feedbackTexts = {};
	let loading = true;

	async function fetchProblems() {
		try {
			const testProblems = await getTestProblems(testId);

			problems = testProblems;
			if (answers.length > 0) {
				for (const ans of answers) {
					answerTexts[ans.problem_id] = ans.answer;
					feedbackTexts[ans.problem_id] = ans.feedback;
					isCorrect[ans.problem_id] = ans.correct;
				}
				answers.sort(
					(a, b) =>
						problems.findIndex((pb) => pb.problem_id === a.problem_id) -
						problems.findIndex((pb) => pb.problem_id === b.problem_id)
				);
				answers = answers;
			} else {
				answers = problems.map((pb) => new TestsolveAnswer(pb.problem_id));
			}
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	fetchProblems();

	function changeAnswer(id) {
		const curAnswer = answers.find((a) => a.problem_id === id);
		curAnswer.answer = answerTexts[id];
	}

	function changeChecked(id) {
		const curAnswer = answers.find((a) => a.problem_id === id);
		curAnswer.correct = isCorrect[id] ?? false;
	}

	function changeFeedback(id) {
		const curAnswer = answers.find((a) => a.problem_id === id);
		curAnswer.feedback = feedbackTexts[id];
	}

	function submitTest() {
		try {
			dispatch("submit");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}
</script>

<div class="test-div">
	<div class="inner-div">
		{#if loading}
			<p>Loading...</p>
		{:else}
			{#each problems as problem}
				<div class="problem-container">
					<div class="problem-div">
						<p>
							<span style="font-size: 30px;">
								{problem.problem_number + 1}.
							</span>
							{#if reviewing}
								({problem.full_problems.front_id})
							{/if}
						</p>
						<Latex
							style="font-size: 16px"
							value={problem.full_problems.problem_latex}
						/>
						{#if reviewing}
							<div style="margin-top: 10px;">
								Answer:
								<Latex
									style="font-size: 16px"
									value={problem.full_problems.answer_latex}
								/>
							</div>
							<div style="margin-top: 10px;">
								Solution:
								<Latex
									style="font-size: 16px"
									value={problem.full_problems.solution_latex}
								/>
							</div>
						{/if}
					</div>
					<div class="feedback-div">
						{#if answerable}
							<div style="margin-top: 10px;">
								<TextInput
									labelText={reviewing ? "Your answer" : "Answer"}
									disabled={reviewing}
									bind:value={answerTexts[problem.problem_id]}
									on:input={(e) => changeAnswer(problem.problem_id)}
								/>
							</div>
						{/if}
						{#if reviewing}
							<div style="margin-top: 3px;">
								<Checkbox
									labelText="Correct?"
									bind:checked={isCorrect[problem.problem_id]}
									on:change={() => changeChecked(problem.problem_id)}
								/>
							</div>
						{/if}
						<div>
							<TextArea
								labelText="Feedback"
								bind:value={feedbackTexts[problem.problem_id]}
								on:input={(e) => changeFeedback(problem.problem_id)}
							/>
						</div>
					</div>
				</div>
			{/each}
		{/if}
		<br />
		<div class="flex">
			<div class="questionsDiv">
				<p style="font-size: 20px">
					<strong>General Testsolving Questions</strong>
				</p>
				<br />
				{#each feedbackAnswers as { feedback_question }, i}
					<p>{i + 1}. {feedbackQuestions[feedback_question].question}</p>
					<TextInput bind:value={feedbackAnswers[i].answer} />
					<br />
				{/each}
			</div>
		</div>
		<br />
		{#if submittable}
			<Button action={submitTest()} title="Submit" />
		{/if}
	</div>
</div>

<style>
	.problem-container {
		display: flex;
	}

	.problem-div,
	.feedback-div {
		background-color: var(--text-color-light);
		border: 2px solid black;
		margin: 10px;
		padding: 20px;
		text-align: left;
		flex-grow: 1;
	}

	.problem-div {
		width: 60%;
	}

	.test-div {
		display: flex;
		justify-content: center;
		padding-bottom: 20px;
	}

	.inner-div {
		width: 80%;
		min-width: 400px;
	}

	.questionsDiv {
		background-color: var(--text-color-light);
		border: 2px solid black;
		padding: 20px;
		text-align: left;
		width: 70%;
	}
</style>
