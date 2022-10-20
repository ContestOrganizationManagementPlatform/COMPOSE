<script>
	import { supabase } from "$lib/supabaseClient";
	import PieChart from "./PieChart.svelte";

	export let problemID;
	let feedbackList;
	let answerList;
	let allAnswers = [];
	let noRepeatAnswers = [];
	let loaded = false;

	async function loadFeedback() {
		let { data, error } = await supabase
			.from("testsolve_answers")
			.select("*,testsolves(users(*))")
			.eq("problem_id", problemID);

		console.log(data);
		// filter empty feedback
		feedbackList = data.filter((fd) => !!fd.feedback);
		answerList = data
			.filter((fd) => fd.answer !== null)
			.map((fd) => ({
				answer: fd.answer,
				correct: fd.correct,
			}));
		groupAnswerList();
		loaded = true;
	}

	function groupAnswerList() {
		let answerMap = new Map();
		for (let ans of answerList) {
			if (ans.correct !== true) ans.correct = false;
			let stringified = JSON.stringify(ans);
			answerMap.set(stringified, (answerMap.get(stringified) ?? 0) + 1);
		}
		answerList = Array.from(answerMap.entries()).map((x) => {
			let str = JSON.parse(x[0]);
			allAnswers.push(x[1]);
			noRepeatAnswers.push(str.answer);
			return {
				answer: str.answer,
				correct: str.correct,
				count: x[1],
			};
		});
		answerList.sort((a, b) => {
			try {
				let aNum = parseFloat(a.answer);
				let bNum = parseFloat(b.answer);
				return aNum - bNum;
			} catch (e) {
				return a.answer.localeCompare(b.answer);
			}
		});
		console.log(answerList);
	}

	// only works on time+s
	function maybePluralize(word, num) {
		return num !== 1 ? word + "s" : word;
	}

	loadFeedback();
</script>

<div class="flex">
	<div class="answer-container">
		<h2>Answers</h2>
		{#if loaded}
			{#if answerList.length === 0}
				<p>No answers to this problem</p>
			{:else}
				<div class="flex">
					<div style="height: 300px;">
						<PieChart labels={noRepeatAnswers} dataSet={allAnswers} />
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
<div class="flex">
	<div class="feedback-container">
		<h2>Feedback</h2>
		{#if loaded}
			{#if feedbackList.length == 0}
				<p>No feedback for this problem</p>
			{:else}
				<div class="row" style="column-gap: 5px;">
					{#each feedbackList as feedback}
						<div class="feedback-box">
							<div
								class="row"
								style="width: calc(100% - 5px); column-gap: 5px; margin-bottom: 5px;"
							>
								<div class="sender">
									<p>
										<strong>From:</strong>
										{feedback.testsolves.users.full_name}
									</p>
								</div>
								<div class="sender">
									<p>
										<strong>Their answer:</strong>
										{feedback.answer ?? "n/a"}
									</p>
								</div>
							</div>
							<div class="sender">
								<p><strong>Feedback:</strong> {feedback.feedback}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
<br />

<style>
	.sender {
		background-color: rgb(234, 234, 234);
		border-radius: 5px;
		padding: 3px 10px;
		width: 100%;
	}

	.feedback-container,
	.answer-container {
		width: 70%;
		margin-bottom: 10px;
	}
	.feedback-box {
		text-align: left;
		border: 2px solid black;
		margin-top: 5px;
		padding: 5px;
	}
</style>
