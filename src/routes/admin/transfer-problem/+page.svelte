<script>
	import { supabase } from "$lib/supabaseClient";
	import { Select, SelectItem } from "carbon-components-svelte";
    import Button from '$lib/components/Button.svelte';

	let problems = [];
	let loading = true;
	let curProblem = 0;
	let users = [];
	let curUser = 0;

	async function getProblems() {
		let { data: problemData, error } = await supabase
			.from("problems")
			.select("id,problem_latex,author_id,users(full_name)");
		if (error) throw error;
		for (let problem of problemData) {
			problems.append({
				id: problem.id,
				latex: problem.problem_latex,
				author_id: problem.author_id,
				author_name: problem.users.full_name,
			});
		}
		getUsers();
		loading = false;
	}

	async function getUsers() {
		let { data: userInfo, error } = await supabase
			.from("users")
			.select("id,full_name");
		if (error) throw error;
		users = userInfo;
	}

	async function transferProblem() {
		const { data, error } = await supabase
			.from("problems")
			.update({ author_id: users[curUser].id })
			.eq("id", problems[curProblem].id);
        if (error) throw error;
	}

	getProblems();
</script>

<h1>Transfer Problems</h1>
{#if loading}
	Loading problems...
{:else}
	<Select labelText="Problem to Transfer" bind:selected={curProblem}>
		{#each problems as problem, i}
			<SelectItem value={i} text={problem.id} />
		{/each}
	</Select>
	<p>Problem: {problems[curProblem].latex}</p>
	<p>
		Current author: {problems[curProblem].author_name} ({problems[curProblem]
			.author_id})
	</p>
	<Select labelText="User to transfer to" bind:selected={curUser}>
		{#each users as user, i}
			<SelectItem value={i} text={user.full_name + " (" + user.id + ")"} />
		{/each}
	</Select>
    <Button title="Transfer Problem" action={transferProblem} />
{/if}
