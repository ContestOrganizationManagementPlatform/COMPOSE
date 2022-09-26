<script>
	import { supabase } from "$lib/supabaseClient";
	import { TextArea, InlineNotification } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import { getThisUserRole } from "$lib/getUserRole";
	import { formatDate } from "$lib/formatDate";

	let errorTrue = false;
	let errorMessage = "";

	let loading = true;
	let isAdmin = false;

	let availableTestsolves = [];

	async function getTestsolves() {
		if ((await getThisUserRole()) >= 40) {
			isAdmin = true;
			// admin can testsolve anything
			let { data: tests, error } = await supabase
				.from("tests")
				.select("id,test_name");
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			} else {
				availableTestsolves = tests.map((x) => ({
					name: x.test_name,
					id: x.id,
					solves: [],
				}));
			}
		} else {
			let { data: testsolves, error } = await supabase
				.from("testsolvers")
				.select("test_id,tests(test_name)")
				.eq("solver_id", supabase.auth.user().id);
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			} else {
				availableTestsolves = testsolves.map((x) => ({
					name: x.tests.test_name,
					id: x.test_id,
					solves: [],
				}));
			}
		}

		getFinishedSolves();
	}

	async function getFinishedSolves() {
		let finishedSolves;
		if (isAdmin) {
			let { data, error } = await supabase
				.from("testsolves")
				.select("*,users(full_name)");
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			}
			finishedSolves = data;
		} else {
			let { data, error } = await supabase
				.from("testsolves")
				.select("*,users(full_name)")
				.eq("solver_id", supabase.auth.user().id);
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			}
			finishedSolves = data;
		}
		for (const solve of finishedSolves) {
			let test = availableTestsolves.find((ts) => ts.id === solve.test_id);
			if (test) {
				test.solves.push(solve);
			}
		}
		availableTestsolves = availableTestsolves;

		loading = false;
	}

	getTestsolves();
</script>

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

<br />
<h1>Testsolving</h1>
<br />
<div>
	<h4>Available testsolves:</h4>
	{#if loading}
		<p>Loading...</p>
	{:else if availableTestsolves.length === 0}
		<p>No available testsolves!</p>
	{:else}
		<div class="grid">
			{#each availableTestsolves as testsolve}
				<div class="box">
					<h3><strong>{testsolve.name}</strong></h3>
					{#if testsolve.solves.length > 0}
						<div class="miniGrid">
							{#each testsolve.solves as solve}
								<div class="miniBox">
									<h5>
										Solve {formatDate(new Date(solve.end_time))} by {solve.users
											.full_name}
									</h5>
									<Button href="/testsolve/{solve.id}" title="View" />
								</div>
							{/each}
						</div>
					{/if}
					<div style="margin-top: 10px">
						<Button
							href="/tests/{testsolve.id}/testsolve/solve"
							title="Begin solve"
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 50% 50%;
	}

	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 10px 20px;
	}

	.miniGrid {
		display: grid;
		grid-template-columns: 100%;
		grid-gap: 5px;
	}
	.miniBox {
		padding: 10px;
		border-bottom: 2px solid var(--green);
	}
</style>
