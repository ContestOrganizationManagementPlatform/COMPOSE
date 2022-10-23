<script>
	import { supabase } from "$lib/supabaseClient";
	import { formatDate } from "$lib/formatDate";
	import Loading from "$lib/components/Loading.svelte";
	import Button from "$lib/components/Button.svelte";

	let loading = true;
	let testsolves = [];

	async function getUpcomingTestsolves() {
		loading = true;
		let { data: testsolveInfo, error } = await supabase
			.from("testsolves")
			.select("*,users(full_name,initials),tests(test_name)");
		if (error) alert(error.message);
		else {
			testsolves = testsolveInfo.map((e) => ({
				id: e.id,
				solver_id: e.solver_id,
				test_id: e.test_id,
				solver_name: e.users.full_name,
				solver_initials: e.users.initials,
				test_name: e.tests.test_name,
				start_time: e.start_time,
				end_time: e.end_time,
				feedback: e.feedback,
			}));
		}
		loading = false;
	}

	getUpcomingTestsolves();
</script>

<br />
<h1 style="margin-bottom: 5px;">Past Testsolves</h1>
<Button href="/admin/testsolves/upcoming" title="Look at upcoming testsolves" />

{#if loading}
	<Loading />
{:else}
	<div class="grid-thirds">
		{#each testsolves as testsolve}
			<div class="box">
				<h3><strong>Testsolve {testsolve.id}</strong></h3>
				<div class="sender">
					<p><u>Test</u>: {testsolve.test_name} ({testsolve.test_id})</p>
				</div>
				<div class="sender">
					<p>
						<u>User</u>: {testsolve.solver_name} ({testsolve.solver_initials})
					</p>
				</div>
				<div class="sender">
					<p><u>Start Time</u>: {formatDate(new Date(testsolve.start_time))}</p>
				</div>
				<div class="sender">
					<p><u>End Time</u>: {formatDate(new Date(testsolve.end_time))}</p>
				</div>
				<div class="sender">
					<p><u>Feedback</u>: {testsolve.feedback}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 5px 20px;
	}

	.sender {
		background-color: rgb(234, 234, 234);
		border-radius: 5px;
		padding: 3px 10px;
		width: 100%;
		margin-bottom: 5px;
		text-align: left;
	}
</style>
