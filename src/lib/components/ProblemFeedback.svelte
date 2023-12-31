<script>
	import PieChart from "./PieChart.svelte";
	import { Checkbox } from "carbon-components-svelte";
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		TextInput,
		Form,
		FormGroup,
		TextArea,
		Dropdown,
		MultiSelect,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";
	import {
		addProblemTestsolveAnswer,
		getProblemTestsolveAnswers,
		updateTestsolveAnswer,
	} from "$lib/supabase";

	export let problem_id;
	export let solver_id;
	let feedbackList = [];
	let answerList;
	let allAnswers = [];
	let noRepeatAnswers = [];
	let showFeedbackPanel = false;
	let loaded = false;
	let pageSize = 25;
	let page = 1;
	let feedbackInput;
	let feedback = "";
	let answer = "";
	let difficulty = 1;
	let quality = 1;

	const difficultyOptions = Array.from({ length: 11 }, (value, index) => {
		return {
			id: index.toString(),
			text: index === 0 ? "Difficulty" : index.toString(),
		};
	});
	const qualityOptions = Array.from({ length: 11 }, (value, index) => {
		return {
			id: index.toString(),
			text: index === 0 ? "Quality" : index.toString(),
		};
	});

	async function loadFeedback() {
		try {
			const data = await getProblemTestsolveAnswers(problem_id, "*,users(*)");

			// filter empty feedback
			const totalFeedbackList = data.filter((fd) => !!fd.feedback);

			feedbackList = totalFeedbackList.map((e) => ({
				id: e.id,
				answer: e.answer,
				feedback: e.feedback,
				resolved: e.resolved,
				user: e.users ? e.users.full_name : "N/A",
				user_discord: e.users ? e.users.discord : "N/A",
				user_id: e.users ? e.users.id : "N/A",
				user_math_background: e.users ? e.users.math_comp_background : "N/A",
			}));

			answerList = data
				.filter((fd) => fd.answer !== null)
				.map((fd) => ({
					answer: fd.answer,
					correct: fd.correct,
				}));
			groupAnswerList();

			loaded = true;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	function groupAnswerList() {
		try {
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
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	// only works on time+s
	function maybePluralize(word, num) {
		return num !== 1 ? word + "s" : word;
	}

	// resolve or unresolve an answer
	async function changeResolve(e, feedback_id) {
		try {
			let newFeedback = {
				resolved: e.detail,
			};
			await updateTestsolveAnswer(feedback_id, newFeedback);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function addFeedback() {
		try {
			await addProblemTestsolveAnswer([
				{
					solver_id: solver_id,
					problem_id: problem_id,
					feedback: feedbackInput,
				},
			]);
			feedbackInput = "";
			loadFeedback();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
		<br />
		<Button
			action={() => {
				showFeedbackPanel = true;
			}}
			title="Add Feedback"
		/>
		<br />
		{#if showFeedbackPanel}
			<Form class="editorForm">
				<FormGroup style="display: flex; align-items: end; gap: 20px">
					<TextInput style="" placeholder="Answer" class="textInput" />
					<Dropdown selectedId="0" items={difficultyOptions} />
					<Dropdown selectedId="0" items={qualityOptions} />
				</FormGroup>
				<div style="position: relative;">
					<TextArea
						class="textArea"
						placeholder="Add Feedback"
						required={true}
					/>
				</div>
			</Form>
			<div class="form-container">
				<form on:submit|preventDefault={addFeedback}>
					<div class="feedback-container">
						<textarea
							placeholder="Add Feedback"
							bind:value={feedback}
							style="width: 100%; resize: vertical; min-height: 100px;"
						/>
					</div>

					<div class="input-row">
						<input type="text" placeholder="Answer" bind:value={answer} />
						<select bind:value={difficulty} class="dropdown">
							<option value="" selected>Difficulty</option>
							{#each difficultyOptions as option (option)}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<select bind:value={quality} class="dropdown">
							<option value="" selected>Quality</option>
							{#each qualityOptions as option (option)}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>

					<div class="input-container" />

					<div class="input-container" />

					<Button type="submit" title="Submit" />
				</form>
			</div>
			<br />
			<textarea
				bind:value={feedbackInput}
				placeholder="Add feedback"
				style="width: 100%; resize: vertical; min-height: 100px;"
			/>
			<br />
			<br />
			<Button action={addFeedback} title="Submit" />
			<br />
		{/if}
		<br />
		{#if loaded}
			{#if feedbackList.length == 0}
				<p>No feedback for this problem</p>
			{:else}
				<br />
				<DataTable
					expandable
					sortable
					size="compact"
					headers={[
						{ key: "user", value: "User", width: "150px" },
						{ key: "feedback", value: "Feedback" },
						{ key: "answer", value: "Answer", width: "100px" },
						{ key: "resolved", value: "Resolved", width: "100px" },
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
							{#if cell.key == "resolved"}
								<p>
									<Checkbox
										bind:checked={feedbackList[rowIndex].resolved}
										style="flex-basis: 0"
										on:check={(e) => changeResolve(e, row.id)}
									/>
								</p>
							{:else}
								<div style="overflow: hidden;">
									{cell.value}
								</div>
							{/if}
						</div>
					</svelte:fragment>
					<svelte:fragment slot="expanded-row" let:row>
						<div style="padding: 10px;">
							<pre><strong>User Discord</strong>: {row.user_discord}</pre>
							<pre><strong>User Math Competition Background</strong
								>: {row.user_math_background}</pre>
						</div>
					</svelte:fragment>
				</DataTable>
			{/if}
		{/if}
	</div>
</div>
<br />

<style>
	.feedback-container,
	.answer-container {
		width: 70%;
		margin-bottom: 10px;
	}

	:global(.bx--table-expand__button) {
		width: 30px;
		height: 20px;
	}

	textarea {
		min-width: 500px;
		min-height: 100px;
	}

	.form-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 100%;
	}

	.input-row {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
	}

	.feedback-container {
		margin-bottom: 20px;
	}
</style>
