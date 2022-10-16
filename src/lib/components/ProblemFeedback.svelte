<script>
	import { supabase } from "$lib/supabaseClient";

	export let problemID;
	let feedbackList;
	let answerList;
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
				<div class="answer-list">
					{#each answerList as answer}
						<div
							class="answer-box"
							class:correct={answer.correct}
							class:incorrect={!answer.correct}
						>
							<p>
								{answer.answer} - {answer.count}
								{maybePluralize("time", answer.count)}
							</p>
						</div>
					{/each}
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
				{#each feedbackList as feedback}
					<div class="feedback-box">
						<p><strong>From:</strong> {feedback.testsolves.users.full_name}</p>
						<p><strong>Their answer:</strong> {feedback.answer ?? "n/a"}</p>
						<p><strong>Feedback:</strong> {feedback.feedback}</p>
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</div>

<style>
	.feedback-container,
	.answer-container {
		width: 70%;
		margin-bottom: 10px;
	}

	.answer-list {
		display: flex;
		justify-content: center;
	}

	.feedback-box {
		text-align: left;
		border: 2px solid black;
		margin-top: 5px;
		padding: 5px;
	}

	.correct {
		background-color: #73ee73;
	}

	.incorrect {
		background-color: #ec8585;
	}

	.answer-box {
		text-align: left;
		border: 1px solid black;
		margin: 5px;
		padding: 3px;
	}
</style>
