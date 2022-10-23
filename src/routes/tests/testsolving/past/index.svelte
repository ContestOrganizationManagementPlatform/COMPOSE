<script>
	import { supabase } from "$lib/supabaseClient.js";
	import Loading from "$lib/components/Loading.svelte";

	let testsolves = [];
	let loading = true;

	async function getTestsolves() {
		let { data: testsolvesData, error } = await supabase
			.from("testsolves")
			.select("*,users(full_name),tests(test_name)");
		if (error) alert(error.message);
		else testsolves = testsolvesData;
		loading = false;
	}

	getTestsolves();
</script>

<br />
{#if loading}
	<Loading />
{:else}
	<h1>Past Testsolves</h1>
	<div class="grid">
		{#each testsolves as testsolve}
			<a href="/tests/testsolving/past/{testsolve.id}" id="main-a">
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
	</div>
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
