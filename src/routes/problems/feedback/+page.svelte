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
	let startTime = new Date();
	let lastTime = startTime;
	let reviewing = false;
	let problemFeedback = {};
    let problem;
	let loaded = false;
    export let user_id = null;
    
    const changeReviewing = () => {
        reviewing = !reviewing;
    }

    const newProblem = () => {
        (async () => {
            loaded = false;
            problem = await getRandomProblem(user_id);
            console.log("WHY", problem);
            reviewing = !reviewing;
            problemFeedback = {};
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



<div class="test-div">
                {#if !loaded}
                    <Loading/>
                    {:else} 
                    <div class="problems">
                        <TestProblems bind:problemFeedback={problemFeedback} {problem} {reviewing}></TestProblems>
                    </div>
                    <div class = "submit-button">
                    {#if !reviewing}
                        <Button action={changeReviewing} title="Submit" ></Button>
                    {:else}
                        <Button action={newProblem} title="Submit" ></Button>
                    {/if}
                    </div>
                {/if}
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