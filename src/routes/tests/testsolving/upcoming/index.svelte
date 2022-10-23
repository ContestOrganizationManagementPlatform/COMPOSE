<script>
	import { supabase } from "$lib/supabaseClient.js";

	let loading = true;
	let testsolvers = [];

	async function getTestsolvers() {
		let { data: testsolversInfo, error } = await supabase
			.from("testsolvers")
			.select("*,users(full_name),tests(test_name)");
		if (error) alert(error.message);
		else testsolvers = testsolversInfo;
		loading = false;
	}

	getTestsolvers();
</script>

{#if loading}
	<p>Fetching upcoming testsolves...</p>
{:else}
	<h1>Upcoming Testsolves</h1>
	{#each testsolvers as testsolve}
		<a href="/tests/testsolving/upcoming/{testsolve.id}" id="main-a">
			<div class="box">
				<h3>#{testsolve.id}</h3>
				<p>
					Solving Test {testsolve.test_id}
					<a href="/tests/{testsolve.test_id}" class="test-link"
						>{testsolve.tests.test_name}</a
					>
				</p>
				<p><strong>Testsolver:</strong> {testsolve.users.full_name}</p>
			</div>
		</a>
	{/each}
{/if}

<style>
	.box {
		background-color: var(--white);
		border: 1px solid var(--green);
		margin: 10px;
		padding: 10px 20px;
		color: black;
		transition: all 0.4s ease-in-out;
	}

	#main-a {
		text-decoration: none;
	}

	#main-a:hover .box {
		background-color: #f4fff8;
	}

	.test-link {
		color: var(--body);
	}
</style>
