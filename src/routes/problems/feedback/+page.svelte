<script lang="js">
	import TestProblems from "$lib/components/TestProblems.svelte";
    import Button from "$lib/components/Button.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import {
        getProblem
	} from "$lib/supabase";
	let startTime = new Date();
	let lastTime = startTime;
	let reviewing = false;
	let problemFeedback = [];
    let problem;
	let loaded = false;
    (async () => {
        problem = await getProblem(113);
        console.log("WHY", problem);
        loaded = true;
    })();
    let problems = [];

    const changeReviewing = () => {
        reviewing = !reviewing;
    }

</script>



<div class="test-div">
                {#if !loaded}
                    <Loading/>
                    {:else} 
                    <TestProblems {problemFeedback} {problem} {reviewing}></TestProblems>
                    <Button action={changeReviewing} title="submit"></Button>
                {/if}
</div>

<style>

	.test-div {
		display: flex;
		justify-content: center;
		padding-bottom: 20px;
	}

	.inner-div {
		width: 80%;
		min-width: 400px;
	}

	.questionsDiv {
		background-color: var(--text-color-light);
		border: 2px solid black;
		padding: 20px;
		text-align: left;
		width: 70%;
	}

	.panel {
		position: fixed;
		right: 0;
		top: 0;
		margin: 10px;
		padding: 10px;
		background-color: var(--text-color-light);
		border: 1px solid black;
	}
</style>