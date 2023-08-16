<script>
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import Loading from "$lib/components/Loading.svelte";
	import { TextInput } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";

	let testId = $page.params.id;
	let feedbackQuestions = [];
	let feedbackAnswers = {};
	let loading = true;
	let curQuestion = "";

	async function getFeedbackQuestions() {
		try {
			loading = true;
			let { data: test_feedback_questions, error } = await supabase
				.from("test_feedback_questions")
				.select("*")
				.eq("test_id", testId);
			if (error) throw error;

			feedbackQuestions = test_feedback_questions;
			if (feedbackQuestions !== []) {
				for (const i of feedbackQuestions) {
					feedbackAnswers[i.id] = [];
				}
				await getFeedbackAnswers();
			}
			loading = false;
		} catch (error) {
			if (error.code !== "PGRST116") {
				handleError(error);
				toast.error(error.message);
			}
		}
	}

	async function getFeedbackAnswers() {
		try {
			let { data: testsolve_feedback_answers, error } = await supabase
				.from("testsolve_feedback_answers")
				.select("*")
				.in(
					"feedback_question",
					feedbackQuestions.map((el) => el.id)
				);
			if (error) throw error;

			for (const i of testsolve_feedback_answers) {
				feedbackAnswers[i.feedback_question].push({
					id: i.id,
					testsolve_id: i.testsolve_id,
					answer: i.answer,
				});
			}
		} catch (error) {
			if (error.code !== "PGRST116") {
				handleError(error);
				toast.error(error.message);
			}
		}
	}

	async function addFeedbackQuestion() {
		try {
			const { data, error } = await supabase
				.from("test_feedback_questions")
				.insert([{ test_id: testId, question: curQuestion }]);
			if (error) throw error;
			else {
				await getFeedbackQuestions();
				curQuestion = "";
			}
			await getFeedbackQuestions();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getFeedbackQuestions();
</script>

{#if loading}
	<Loading />
{:else}
	<h2><strong>Current Feedback Questions</strong></h2>
	<br />
	<div class="flex">
		<div style="width: 60%">
			{#if feedbackQuestions.length > 0}
				{#each feedbackQuestions as question}
					<h4><strong>{question.question}</strong></h4>
					<ol>
						{#each feedbackAnswers[question.id] as answer}
							<li style="margin-bottom: 8px;">
								<a href={"/testsolve/" + answer.testsolve_id}
									>Testsolve {answer.testsolve_id}</a
								>: {answer.answer}
							</li>
						{/each}
					</ol>
				{/each}
			{:else}
				<p>There are no current questions.</p>
			{/if}
		</div>
	</div>
	<br />
	<h2><strong>Add New Feedback Question</strong></h2>
	<div class="flex">
		<div style="width: 60%">
			<TextInput labelText="Feedback Question" bind:value={curQuestion} />
		</div>
	</div>
	<br />
	<Button action={addFeedbackQuestion} title="Submit" />
	<br />
	<br />
	<br />
	<Button href={`/tests/${testId}`} title="Back to test" />
{/if}
