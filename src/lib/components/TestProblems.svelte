<!-- TestProblems.svelte-->

<script>
	import {
		Checkbox,
		TextArea,
		TextInput,
		Dropdown,
	} from "carbon-components-svelte";
	import { formatTime } from "$lib/formatDate";
	import { handleError } from "$lib/handleError";
	import Latex from "$lib/components/Latex.svelte";
	import toast from "svelte-french-toast";
	export let problemFeedback = {};
	console.log("FEDBACK", problemFeedback);
	export let problem;
	console.log("PROB", problem.id);
	export let problemNumber = null;
	export let testsolve_id = null;
	export let user_id = null;
	export let reviewing = false;
	export let lastTime = new Date();
	export let givingFeedback = false;
	let screen_width = screen.width;
	console.log("PROBLEM", problem)
	import {
		getTestProblems,
		getThisUser,
		getTestsolveProblemFeedback,
		upsertProblemFeedback,
		updateTestsolve,
		upsertTestsolveFeedbackAnswers,
		getTestsolveFeedbackAnswers,
		getFeedbackQuestions,
	} from "$lib/supabase";

	(async () => {
		try {
			if (!user_id) {
				user_id = (await getThisUser()).id;
				console.log(user_id);
			}	
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	})();
	
	function changeChecked(id) {
		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve_id,
				solver_id: user_id,
				correct: problemFeedback.correct,
			},
		];
		upsertProblemFeedback(feedback);
	}

	function changeFeedback(id) {
		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve_id,
				solver_id: user_id,
				feedback: problemFeedback.feedback,
			},
		];
		upsertProblemFeedback(feedback);
	}

	let diffWarn = null;
	function changeDifficulty(id) {
		console.log(problemFeedback);
		const num = parseInt(problemFeedback.difficulty);
		console.log(num, "NUM");
		if (
			problemFeedback.difficulty == "" ||
			(!isNaN(num) && num >= 1 && num <= 10)
		) {
			const feedback = [
				{
					problem_id: id,
					testsolve_id: testsolve_id,
					solver_id: user_id,
					difficulty: num,
				},
			];
			upsertProblemFeedback(feedback);
		} else {
			toast.error("You must enter an integer from 1-10, or leave it blank");
			problemFeedback.difficulty = "";
		}
		// Check if the value is within the range of 1 to 10 (inclusive)
	}

	let qualWarn = null;
	function changeQuality(id) {
		console.log(problemFeedback);
		const num = parseInt(problemFeedback.quality);
		console.log(num, "NUM");
		if (
			problemFeedback.quality == "" ||
			(!isNaN(num) && num >= 1 && num <= 10)
		) {
			const feedback = [
				{
					problem_id: id,
					testsolve_id: testsolve_id,
					solver_id: user_id,
					quality: num,
				},
			];
			upsertProblemFeedback(feedback);
		} else {
			toast.error("You must enter an integer from 1-10, or leave it blank");
			problemFeedback.quality = "";
		}
		// Check if the value is within the range of 1 to 10 (inclusive)
	}

	function changeAnswer(e, id) {
		const nowTime = new Date().getTime();
		const problemTime =
			nowTime - lastTime + problemFeedback.time_elapsed;
			console.log("T", problemTime);
			console.log("I", nowTime);
			console.log("M", lastTime);
			console.log("E", problemFeedback.time_elapsed);
		lastTime = nowTime;

		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve_id,
				solver_id: user_id,
				answer: problemFeedback.answer,
				time_elapsed: problemTime, //time elapsed becomes undefined
			},
		];
		problemFeedback.time_elapsed = problemTime;
		upsertProblemFeedback(feedback);
		console.log("f", problemFeedback.time_elapsed);
	}

</script>

<div class="problem-container">
					<div class="problem-div">
						<p>
							{#if problemNumber}
								<span style="font-size: 30px;">
									{problemNumber + 1}.
								</span>
							{/if}
							{#if reviewing || givingFeedback}
								({problem.front_id})
							{/if}
						</p>
						<!--How problem is initially displayed-->
						<div class="problem-latex">
						<Latex 
							style="font-size: 16px"
							value={problem.problem_latex}
						/>
						</div>
						<!--Change problem when reviewing/submitted-->
						{#if reviewing}
							<div style="margin-top: 10px;">
								Answer:
								<Latex
									style="font-size: 16px"
									value={problem.answer_latex}
								/>
							</div>
							<div style="margin-top: 10px;">
								Solution:
								<Latex
									style="font-size: 16px"
									value={problem.solution_latex}
								/>
							</div>
						{/if}
					</div>
					<div class="feedback-div">
						<div>
							Time: {formatTime(
								problemFeedback.time_elapsed
							)}
						</div>
						<div style="margin-top: 10px;">
							<TextInput
								labelText={reviewing ? "Your answer" : "Answer"}
								disabled={reviewing}
								bind:value={problemFeedback.answer}
								on:blur={(e) => changeAnswer(e, problem.id)}
							/>
						</div>
						{#if reviewing}
							<div style="margin-top: 3px;">
								<Checkbox
									labelText="Correct?"
									bind:checked={problemFeedback.correct}
									on:change={() => changeChecked(problem.id)}
								/>
							</div>
						{/if}
						<div>
							<TextArea
								labelText="Feedback"
								bind:value={problemFeedback.feedback}
								on:blur={(e) => changeFeedback(problem.id)}
							/>
						</div>
						{#if reviewing}
							<br />
							<div class="flex">
								<div style="margin: 3px">
									<TextInput
										labelText={"Difficulty"}
										placeholder={"1-10"}
										bind:value={problemFeedback
											.difficulty}
										on:change={(e) => {
											console.log("CHANGED DIFF", e);
											changeDifficulty(problem.id);
										}}
									/>
								</div>
								<div style="margin: 3px">
									<TextInput
										labelText={"Quality"}
										placeholder={"1-10"}
										bind:value={problemFeedback.quality}
										on:change={(e) => {
											changeQuality(problem.id);
										}}
									/>
								</div>
							</div>
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

	.problem-latex
	{
		margin: 10px;
	}

	.problem-div {
		width: 60%;
	}
</style>