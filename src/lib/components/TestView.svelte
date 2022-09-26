<script>
	import { supabase } from "$lib/supabaseClient";
	import Latex from "$lib/components/Latex.svelte";
	import { Checkbox, TextArea, TextInput } from "carbon-components-svelte";
	import { TestsolveAnswer } from "$lib/TestsolveAnswer";
	import { createEventDispatcher } from "svelte";
	import Button from "$lib/components/Button.svelte";

	const dispatch = createEventDispatcher();

	export let testId;
	export let reviewing = false;
	export let answerable = false;
	export let submittable = false;
	export let answers = [];

	let problems = [];
	let answerTexts = {};
	let isCorrect = {};
	let feedbackTexts = {};
	let loading = true;

	async function fetchProblems() {
		let { data: testProblems, error } = await supabase
			.from("test_problems")
			.select("*,full_problems(*)")
			.eq("test_id", testId)
			.order("problem_number");

		problems = testProblems;
		answers = problems.map((pb) => new TestsolveAnswer(pb.problem_id));
		loading = false;
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
		dispatch("submit");
	}
</script>

<div class="test-div">
	<div class="inner-div">
		{#if loading}
			<p>Loading...</p>
		{:else}
			{#each problems as problem}
				<div class="problem-div">
					<h3>{problem.problem_number + 1}.</h3>
					<Latex
						style="font-size: 16px"
						value={problem.full_problems.problem_latex}
					/>
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
						<div style="margin-top: 10px;">
							Answer:
							<Latex
								style="font-size: 16px"
								value={problem.full_problems.answer_latex}
							/>
						</div>
						<div style="margin-top: 3px;">
							<Checkbox
								labelText="Correct?"
								bind:checked={isCorrect[problem.problem_id]}
								on:change={() => changeChecked(problem.problem_id)}
							/>
						</div>
						<div style="margin-top: 10px">
							<TextArea
								labelText="Feedback"
								bind:value={feedbackTexts[problem.problem_id]}
								on:input={(e) => changeFeedback(problem.problem_id)}
							/>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
		{#if submittable}
			<Button action={submitTest} title="Submit" />
		{/if}
	</div>
</div>

<style>
	.problem-div {
		background-color: var(--white);
		border: 2px solid black;
		margin: 10px;
		padding: 20px;
		text-align: left;
	}

	.test-div {
		display: flex;
		justify-content: center;
	}

	.inner-div {
		width: 60%;
		min-width: 400px;
	}
</style>