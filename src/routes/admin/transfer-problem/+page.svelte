<script lang="ts">
	import { getProblems, editProblem, getAllUsers } from "$lib/supabase";
	import {
		Select,
		SelectItem,
		ToastNotification,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Problem from "$lib/components/Problem.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";

	let problems = [];
	let loading = true;
	let curProblem = 0;
	let users = [];
	let curUser = 0;
	let show = false;

	async function getProblemData() {
		try {
			let problemData = await getProblems({
				customSelect:
					"id,problem_latex,answer_latex,solution_latex,comment_latex,author_id,users(full_name)",
			});
			for (let problem of problemData) {
				problems.push({
					id: problem.id,
					problem_latex: problem.problem_latex,
					answer_latex: problem.answer_latex,
					solution_latex: problem.solution_latex,
					comment_latex: problem.comment_latex,
					author_id: problem.author_id,
					author_name: problem.users.full_name,
				});
			}
			problems.sort((book1, book2) => {
				return book1.id > book2.id ? 1 : book1.id < book2.id ? -1 : 0;
			});
			getUsers();
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getUsers() {
		try {
			users = await getAllUsers();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function transferProblem() {
		try {
			await editProblem(
				{ author_id: users[curUser].id },
				problems[curProblem].id
			);
			show = true;
			setInterval(() => {
				show = false;
			}, 3000);
			toast.success("Successfully transferred problem");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getProblemData();
</script>

<br />

{#if show}
	<div style="position: absolute; bottom: 15px;left:15px;">
		<ToastNotification
			lowContrast
			kind="success"
			title="Success!"
			subtitle="Transfered problem easily!"
			caption={new Date().toLocaleString()}
		/>
	</div>
{/if}

<h1>Transfer Problems</h1>
{#if loading}
	<Loading />
{:else}
	<p>
		Current author: {problems[curProblem].author_name}
	</p>
	<div style="padding: 20px;">
		<Select labelText="Problem to Transfer" bind:selected={curProblem}>
			{#each problems as problem, i}
				<SelectItem value={i} text={problem.id} />
			{/each}
		</Select>
		<br />
		<Problem problem={problems[curProblem]} />
		<br />
		<Select labelText="User to transfer to" bind:selected={curUser}>
			{#each users as user, i}
				<SelectItem value={i} text={user.full_name} />
			{/each}
		</Select>
		<br />
		<Button title="Transfer Problem" action={transferProblem} />
	</div>
{/if}
