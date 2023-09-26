<script>
	import { supabase } from "$lib/supabaseClient";
	import { getThisUserRole } from "$lib/getUserRole";
	import { page } from "$app/stores";
	import toast from "svelte-french-toast";
	import { formatTime } from "$lib/formatDate";
	import TestView from "$lib/components/TestView.svelte";
	import Button from "$lib/components/Button.svelte";
	import { handleError } from "$lib/handleError.ts";
	import { getFeedbackQuestions, removeTestsolver } from "$lib/supabase";

	let loading = true;
	let disallowed = true;

	let answers = [];
	let feedbackQuestions = {};
	let feedbackAnswers = [];

	let startTime = null;
	let endTime = null;
	let isAdmin;

	let testsolve = null;
	let timeElapsed;
	$: timeElapsed =
		testsolve?.time_elapsed * 1000 ??
		new Date(testsolve?.end_time).getTime() -
			new Date(testsolve?.start_time).getTime();

	async function getLocalFeedbackQuestions() {
		try {
			const test_feedback_questions = await getFeedbackQuestions(
				testsolve.test_id
			);

			for (const x of test_feedback_questions) {
				feedbackQuestions[x.id] = x;
				feedbackAnswers.push({
					feedback_question: x.id,
					answer: "",
				});
			}
		} catch (error) {
			if (error.code !== "PGRST116") {
				handleError(error);
				toast.error(error);
			}
		}
	}

	async function getFeedbackAnswers() {
		try {
			let { data: data3, error: error3 } = await supabase
				.from("testsolve_feedback_answers")
				.select("*")
				.eq("testsolve_id", $page.params.id);
			if (error3) throw error3;
			else feedbackAnswers = data3;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function deleteTestsolve() {
		try {
			if (isAdmin) {
				await removeTestsolver($page.params.id);
				toast.success("Successfully deleted testsolve!");
				window.location.href = "/manage-testsolves";
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function permissionCheck() {
		try {
			// check permission
			let { data, error } = await supabase
				.from("testsolves")
				.select("*")
				.eq("id", $page.params.id);
			if (error) {
				throw error;
			} else if (data.length === 0) {
				throw new Error(
					"Testsolve with id " + $page.params.id + " doesn't exist!"
				);
			} else {
				testsolve = data[0];
				if (
					(await getThisUserRole()) === 40 ||
					testsolve.solver_id === supabase.auth.user().id
				) {
					disallowed = false;
				} else {
					// check if test coordinator
					let { data2, error2, count } = await supabase
						.from("test_coordinators")
						.select("*", { count: "exact", head: true })
						.eq("coordinator_id", supabase.auth.user().id)
						.eq("test_id", testsolve.test_id);
					if (error2) {
						throw error2;
					} else if (count > 0) {
						disallowed = false;
					}
				}
			}

			if (disallowed) {
				loading = false;
			} else {
				getAnswers();
				getLocalFeedbackQuestions();
				getFeedbackAnswers();
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getAnswers() {
		try {
			let { data, error } = await supabase
				.from("testsolve_answers")
				.select("*")
				.eq("testsolve_id", $page.params.id);

			if (error) {
				throw error;
			} else {
				answers = data;
				loading = false;
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	permissionCheck();

	async function submitTestsolve() {
		try {
			endTime = new Date();

			let { data, error } = await supabase
				.from("testsolves")
				.update({
					feedback: "", // TODO: allow feedback update
				})
				.eq("id", $page.params.id);

			if (error) {
				throw error;
			} else {
				// delete old answers
				let { error3 } = await supabase
					.from("testsolve_answers")
					.delete()
					.eq("testsolve_id", $page.params.id);

				if (error3) {
					throw error3;
				} else {
					let { data2, error2 } = await supabase
						.from("testsolve_answers")
						.insert(
							answers.map((ans) => ({
								testsolve_id: $page.params.id,
								problem_id: ans.problem_id,
								answer: ans.answer,
								feedback: ans.feedback,
								correct: ans.correct,
							}))
						);

					if (error2) {
						throw error2;
					} else {
						loading = true;
						for (const ans of feedbackAnswers) {
							let { error: error2 } = await supabase
								.from("testsolve_feedback_answers")
								.update({
									testsolve_id: $page.params.id,
									feedback_question: ans.feedback_question,
									answer: ans.answer,
								})
								.eq("id", ans.id);
							if (error2) {
								toast.error(error2.message);
							}
						}
						getAnswers();
						getFeedbackAnswers();
					}
				}
			}
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function loadIsAdmin() {
		try {
			const role = await getThisUserRole();
			if (role >= 40) {
				isAdmin = true;
			} else {
				isAdmin = false;
			}
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
			isAdmin = false;
		}
	}
	loadIsAdmin();
</script>

{#if loading}
	<p>Loading...</p>
{:else if disallowed}
	<p>You are not a testsolver for this test!</p>
{:else}
	<br />
	{#if isAdmin}
		<Button action={deleteTestsolve} title="Delete Testsolve" />
	{/if}
	<br />

	<TestView
		testId={testsolve.test_id}
		bind:answers
		answerable
		reviewing
		on:submit={submitTestsolve}
		{feedbackAnswers}
		{feedbackQuestions}
	/>
	<Button action={submitTestsolve} title="Submit" />
	<br />
	<div class="timer">
		<p>Time taken: {formatTime(timeElapsed, { hideHours: true })}</p>
	</div>
{/if}

<style>
	.timer {
		position: absolute;
		right: 0;
		top: 0;
		margin: 10px;
		padding: 10px;
		background-color: var(--text-color-light);
		border: 1px solid black;
	}
</style>
