<script lang="js">
	import Latex from "$lib/components/Latex.svelte";
	import {
		Checkbox,
		TextArea,
		TextInput,
		Dropdown,
	} from "carbon-components-svelte";
	import { page } from "$app/stores";
	import { TestsolveAnswer } from "$lib/TestsolveAnswer";
	import { supabase } from "$lib/supabaseClient";
	import { createEventDispatcher } from "svelte";
	import { formatTime } from "$lib/formatDate";
	import { onDestroy, onMount } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		getTestProblems,
		getTestsolveProblemFeedback,
		upsertProblemFeedback,
		updateTestsolve,
		upsertTestsolveFeedbackAnswers,
		getTestsolveFeedbackAnswers,
		getFeedbackQuestions,
	} from "$lib/supabase";

	const dispatch = createEventDispatcher();

	export let testsolve;
	export let reviewing = false;
	export let answerable = false;
	export let submittable = false;
	export let feedbackAnswers = [];
	export let feedbackQuestions = {};
	export let problemFeedbackObject = {
		answer: "",
		feedback: "",
		correct: false,
		quality: null,
		difficulty: null,
		time_elapsed: 0,
	};
	export let testFeedbackObject = {
		answer: "",
	};

	let problemFeedback = [];
	let testFeedback = [];
	let problemFeedbackMap = {};
	let testFeedbackMap = {};

	(async () => {
		await getFeedback();
		await fetchProblems();
		console.log("FEEDBACK", problemFeedback);
		loading = false;
	})();

	async function getFeedback() {
		try {
			problemFeedback = await getTestsolveProblemFeedback(
				Number($page.params.id)
			);
			testFeedback = await getTestsolveFeedbackAnswers(Number($page.params.id));
			console.log("TESTFEEDBACK", testFeedback);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	// Create a function to handle inserts
	const handleProblemsUpsert = (payload) => {
		console.log("UPSERT", payload);
		const filteredObj = Object.keys(payload.new)
			.filter((key) => key in problemFeedbackObject)
			.reduce((acc, key) => {
				acc[key] = payload.new[key];
				return acc;
			}, {});
		problemFeedbackMap[payload.new.problem_id] = filteredObj;
		lastTime = new Date().getTime();
	};

	// Create a function to handle inserts
	const handleTestsUpsert = (payload) => {
		console.log("PAY", payload);
		console.log("Tests UPSERT", payload);
		const filteredObj = Object.keys(payload.new)
			.filter((key) => key in testFeedbackObject)
			.reduce((acc, key) => {
				acc[key] = payload.new[key];
				return acc;
			}, {});
		testFeedbackMap[payload.new.feedback_question] = { ...filteredObj };
	};

	// Listen to inserts
	supabase
		.channel("testsolve-problems-" + testsolve.id)
		.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "problem_feedback",
				filter: "testsolve_id=eq." + testsolve.id,
			},
			handleProblemsUpsert
		)
		.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: "problem_feedback",
				filter: "testsolve_id=eq." + testsolve.id,
			},
			handleProblemsUpsert
		)
		.subscribe();

	supabase
		.channel("testsolve-tests-" + testsolve.id)
		.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "testsolve_feedback_answers",
				filter: "testsolve_id=eq." + testsolve.id,
			},
			handleTestsUpsert
		)
		.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: "testsolve_feedback_answers",
				filter: "testsolve_id=eq." + testsolve.id,
			},
			handleTestsUpsert
		)
		.subscribe();

	let problems = [];
	let questions = [];
	let loading = true;
	let startTime = new Date();
	let lastTime = startTime;
	let timeElapsed;
	let timerInterval;

	if (!reviewing) {
		timeElapsed = 0;
		if (!testsolve.startTime) {
			(async () => {
				updateTestsolve(testsolve.id, {
					start_time: startTime,
					time_elapsed: 0,
				});
			})();
		}
		console.log(testsolve);
		function updateTimer() {
			if (!startTime) return;
			timeElapsed =
				new Date().getTime() -
				startTime.getTime() +
				(testsolve.time_elapsed ? testsolve.time_elapsed : 0);
		}

		timerInterval = setInterval(updateTimer, 1000);
	} else {
		timeElapsed = testsolve.time_elapsed;
	}

	onMount(() => {
		// Handle beforeunload event
		window.addEventListener("beforeunload", async () => {
			await updateTestsolve(testsolve.id, { time_elapsed: timeElapsed });
			final = [];
			for (const [id, item] of Object.entries(problemFeedbackMap)) {
				final.push({ ...item, problem_id: id, testsolve_id: testsolve.id });
			}
			console.log("FEEDBACK", final[0]);
			alert("Before unload event triggered.");
			await upsertProblemFeedback(final);
		});
	});

	onDestroy(async () => {
		console.log("Destroying");
		supabase.removeChannel("testsolve-problems-" + testsolve.id);
		timerInterval ?? clearInterval(timerInterval);
	});

	async function fetchProblems() {
		try {
			problems = await getTestProblems(testsolve.test_id);
			problemFeedback.forEach((obj) => {
				const filteredObj = Object.keys(obj)
					.filter((key) => key in problemFeedbackObject)
					.reduce((acc, key) => {
						acc[key] = obj[key];
						return acc;
					}, {});
				problemFeedbackMap[obj.problem_id] = { ...filteredObj };
			});
			for (const problem of problems) {
				console.log("PROB", problem);
				if (!(problem.problem_id in problemFeedbackMap)) {
					problemFeedbackMap[problem.problem_id] = { ...problemFeedbackObject };
				}
			}
			console.log("MAP", problemFeedbackMap);
			console.log("TestFEEDBACK2", testFeedback);
			questions = await getFeedbackQuestions(testsolve.test_id);
			console.log("TestFEEDBACK3", testFeedback, { ...testFeedbackObject });
			testFeedback.forEach((obj) => {
				const filteredObj = Object.keys(obj)
					.filter((key) => key in testFeedbackObject)
					.reduce((acc, key) => {
						acc[key] = obj[key];
						return acc;
					}, {});
				console.log("f", filteredObj, obj);
				testFeedbackMap[obj.feedback_question] = { ...filteredObj };
				console.log({ ...testFeedbackMap });
			});
			console.log(questions);
			console.log(testFeedbackMap);
			for (const question of questions) {
				console.log("QUES", question);
				if (!(question.id in testFeedbackMap)) {
					testFeedbackMap[question.id] = {
						...testFeedbackObject,
					};
				}
			}
			console.log("TestFEEDBACK4", testFeedback);
			console.log("MAP", testFeedbackMap);

			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	function sanitizeInput(input) {
		return input.trim();
	}

	function changeAnswer(e, id) {
		(async () => {
			updateTestsolve(testsolve.id, { time_elapsed: timeElapsed });
		})();
		const nowTime = new Date().getTime();
		const problemTime =
			nowTime - lastTime + problemFeedbackMap[id].time_elapsed;
		lastTime = nowTime;
		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve.id,
				answer: problemFeedbackMap[id].answer,
				time_elapsed: problemTime,
			},
		];
		upsertProblemFeedback(feedback);
	}

	function changeFeedbackAnswer(e, id) {
		console.log(id);
		const feedback = [
			{
				testsolve_id: testsolve.id,
				feedback_question: id,
				answer: testFeedbackMap[id].answer,
			},
		];
		upsertTestsolveFeedbackAnswers(feedback);
	}

	function changeChecked(id) {
		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve.id,
				correct: problemFeedbackMap[id].correct,
			},
		];
		upsertProblemFeedback(feedback);
	}

	function changeFeedback(id) {
		const feedback = [
			{
				problem_id: id,
				testsolve_id: testsolve.id,
				feedback: problemFeedbackMap[id].feedback,
			},
		];
		upsertProblemFeedback(feedback);
	}

	let diffWarn = null;
	function changeDifficulty(id) {
		console.log(problemFeedbackMap[id]);
		const num = parseInt(problemFeedbackMap[id].difficulty);
		console.log(num, "NUM");
		if (
			problemFeedbackMap[id].difficulty == "" ||
			(!isNaN(num) && num >= 1 && num <= 10)
		) {
			diffWarn = null;
			const feedback = [
				{
					problem_id: id,
					testsolve_id: testsolve.id,
					difficulty: num,
				},
			];
			upsertProblemFeedback(feedback);
		} else {
			diffWarn = "You must enter an integer from 1-10, or leave it blank";
		}
		// Check if the value is within the range of 1 to 10 (inclusive)
	}

	let qualWarn = null;
	function changeQuality(id) {
		console.log(problemFeedbackMap[id]);
		const num = parseInt(problemFeedbackMap[id].quality);
		console.log(num, "NUM");
		if (
			problemFeedbackMap[id].quality == "" ||
			(!isNaN(num) && num >= 1 && num <= 10)
		) {
			qualWarn = null;
			const feedback = [
				{
					problem_id: id,
					testsolve_id: testsolve.id,
					quality: num,
				},
			];
			upsertProblemFeedback(feedback);
		} else {
			qualWarn = "You must enter an integer from 1-10, or leave it blank";
		}
		// Check if the value is within the range of 1 to 10 (inclusive)
	}

	function completeTest() {
		try {
			console.log("DISPATCHING");
			dispatch("complete");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
			<br />
			{#if reviewing}
				<div class="flex">
					<div class="questionsDiv">
						<p style="font-size: 20px">
							<strong>General Testsolving Questions</strong>
						</p>
						<br />
						{#each questions as question, i}
							<p>{i + 1}. {question.question}</p>
							<TextArea
								bind:value={testFeedbackMap[question.id].answer}
								on:blur={(e) => changeFeedbackAnswer(e, question.id)}
							/>
							<br />
						{/each}
					</div>
				</div>
			{/if}
			<br />
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
							<div>
								Time: {formatTime(
									problemFeedbackMap[problem.problem_id].time_elapsed
								)}
							</div>
							<div style="margin-top: 10px;">
								<TextInput
									labelText={reviewing ? "Your answer" : "Answer"}
									disabled={reviewing}
									bind:value={problemFeedbackMap[problem.problem_id].answer}
									on:blur={(e) => changeAnswer(e, problem.problem_id)}
								/>
							</div>
						{/if}
						{#if reviewing}
							<div style="margin-top: 3px;">
								<Checkbox
									labelText="Correct?"
									bind:checked={problemFeedbackMap[problem.problem_id].correct}
									on:change={() => changeChecked(problem.problem_id)}
								/>
							</div>
							<div>
								<TextArea
									labelText="Feedback"
									bind:value={problemFeedbackMap[problem.problem_id].feedback}
									on:blur={(e) => changeFeedback(problem.problem_id)}
								/>
							</div>
							<br />
							<div class="flex">
								<div style="margin: 3px">
									<TextInput
										labelText={"Difficulty"}
										placeholder={"1-10"}
										bind:value={problemFeedbackMap[problem.problem_id]
											.difficulty}
										warn={diffWarn ? true : false}
										warnText={diffWarn ?? ""}
										on:change={(e) => {
											console.log("CHANGED DIFF", e);
											changeDifficulty(problem.problem_id);
										}}
									/>
								</div>
								<div style="margin: 3px">
									<TextInput
										labelText={"Quality"}
										placeholder={"1-10"}
										bind:value={problemFeedbackMap[problem.problem_id].quality}
										warn={qualWarn ? true : false}
										warnText={qualWarn ?? ""}
										on:change={(e) => {
											changeQuality(problem.problem_id);
										}}
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}

		{#if submittable}
			<Button action={submitTest()} title="Submit" />
		{/if}
	</div>
</div>
{#if reviewing}
	<div class="panel">
		<p>Total Time: {formatTime(timeElapsed, { hideHours: false })}</p>
		<Button action={submitTest} title="Submit" bwidth="100%" />
	</div>
{:else}<div class="panel">
		<p>Time elapsed: {formatTime(timeElapsed, { hideHours: false })}</p>
		<Button action={completeTest} title="Complete" bwidth="100%" />
	</div>{/if}

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

	.panel {
		position: fixed;
		right: 0;
		top: 0;
		margin: 10px;
		padding: 10px;
		background-color: var(--text-color-light);
		border: 1px solid black;
	}
</style>
