<script>
	import { supabase } from "$lib/supabaseClient";
	import Problem from "$lib/components/Problem.svelte";
	import Menu from "$lib/components/Menu.svelte";

	let problems = [];
	(async () => {
		let { data: newProblems, error } = await supabase
			.from("problems")
			.select("*");
		problems = newProblems;
	})();
</script>

<Menu />
{#each problems as problem}
	<Problem {problem} />
{/each}
