<script lang="js">
	import TestProblems from "$lib/components/TestProblems.svelte";
    import Button from "$lib/components/Button.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import {
        getProblem,
        getThisUser,
        getRandomProblem,
	} from "$lib/supabase";
    import { handleError } from "$lib/handleError";
	import toast from "svelte-french-toast";
    import TestsolveList from "$lib/components/TestsolveList.svelte";
	let startTime = new Date();
	let lastTime = startTime;
	let reviewing = false;
    let problem;
	let problemFeedback = {
        problem_id: null,
        quality: null,
        difficulty: null,
        feedback: null,
        correct: null,
        solver_id: null,
        time_elapsed: 0,
    };
	let loaded = false;
    export let user_id = null;
    export let testsolves = [];
    const changeReviewing = () => {
        reviewing = !reviewing;
    }

    const newProblem = () => {
        (async () => {
            loaded = false;
            problem = await getRandomProblem(user_id);
            console.log("WHY", problem);
            reviewing = !reviewing;
            problemFeedback = {
                problem_id: null,
                quality: null,
                difficulty: null,
                feedback: null,
                correct: null,
                solver_id: null,
                time_elapsed: 0,
            };
            console.log("PLS", problemFeedback);
            loaded = true;
        })();
        
    }
    
    (async () => {
        try {
			if (!user_id) {
				user_id = (await getThisUser()).id;
			}	
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}

        problem = await getRandomProblem(user_id);
        console.log("KYU", problem);
        loaded = true;

    })();
    
    
</script>

<br />
<h1>Problem Feedback</h1>
<br />
<div class="test-div">
                {#if !loaded}
                    <br />
                    <Loading/>
                    {:else} 
                    <h4><strong>Give Feedback:</strong></h4>
                    <div class="problems">
                        <TestProblems bind:problemFeedback={problemFeedback} {problem} {reviewing} givingFeedback={true}></TestProblems>
                    </div>
                    <div class = "submit-button">
                    {#if !reviewing}
                        <Button action={changeReviewing} title="Continue" ></Button>
                    {:else}
                        <Button action={newProblem} title="Submit" ></Button>
                    {/if}
                    </div>
                {/if}
                <br/>
                <!--
                {#if loaded}
                    <h4><strong>View Past Feedback:</strong></h4>
                    <TestsolveList {testsolves} adminView={false} />
                {/if}
                -->
</div>


<style>

	.problems {
		display: flex;
		justify-content: center;
		padding-bottom: 20px;
	}
    .submit-button {
        display:flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding-bottom: 20px;
    }
</style>