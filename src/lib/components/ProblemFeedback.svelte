<script>
	import { supabase } from "$lib/supabaseClient";
	import PieChart from "./PieChart.svelte";
	import { Checkbox } from "carbon-components-svelte";
	import {
		DataTable,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";

	export let problemID;
	let feedbackList = [];
	let answerList;
	let allAnswers = [];
	let noRepeatAnswers = [];
	let loaded = false;
	let pageSize = 25;
	let page = 1;

	async function loadFeedback() {
		let { data, error } = await supabase
			.from("testsolve_answers")
			.select("*,testsolves(users(*))")
			.eq("problem_id", problemID);

		// filter empty feedback
		const totalFeedbackList = data.filter((fd) => !!fd.feedback);

		feedbackList = totalFeedbackList.map((e, i) => ({
			id: i,
			answer: e.answer,
			feedback: e.feedback,
			resolved: e.resolved,
			user: e.testsolves.users.full_name ?? "",
		}));

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
	}

	// only works on time+s
	function maybePluralize(word, num) {
		return num !== 1 ? word + "s" : word;
	}

	// resolve or unresolve an answer
	async function changeResolve(e, feedback) {
		let newFeedback = {
			resolved: e.detail,
		};

		let { error } = await supabase
			.from("testsolve_answers")
			.update(newFeedback)
			.eq("id", feedback.id);

		if (error) alert(error.message);
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
				<DataTable
					sortable
					size="compact"
					headers={[
						{ key: "id", value: "ID", width: "100px" },
						{ key: "user", value: "User" },
						{ key: "answer", value: "Answer" },
						{ key: "feedback", value: "Feedback" },
						{ key: "resolved", value: "Resolved" },
					]}
					rows={feedbackList}
					{pageSize}
					{page}
				>
					<Toolbar size="sm">
						<ToolbarContent>
							<ToolbarSearch persistent shouldFilterRows />
						</ToolbarContent>
					</Toolbar>

					<svelte:fragment slot="cell" let:row let:cell let:rowIndex>
						<div>
							<div style="overflow: hidden;">
								{cell.value == null || cell.value == "" ? "None" : cell.value}
							</div>
						</div>
					</svelte:fragment>
				</DataTable>
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
