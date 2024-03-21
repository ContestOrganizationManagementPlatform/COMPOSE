<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { Modal } from "carbon-components-svelte";
	//import { Modal } from "flowbite-svelte";
	import { displayLatex } from "$lib/latexStuff";
	import Button from "$lib/components/Button.svelte";
	import ImageZoomer from "$lib/components/ImageZoomer.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import { LightenDarkenColor } from "$lib/utils/Colors.svelte";
	import Loading from "$lib/components/Loading.svelte";

	import {
		getThisUser,
		fetchNewTakerResponses,
		submitGrade,
		undoGrade,
	} from "$lib/supabase";

	/**
	 * Possible grades / actions for the grader to submit.
	 * @enum {{name: string, color: string}}
	 */
	const Grade = Object.freeze({
		CORRECT: { name: "Correct", color: "#9BFF99" },
		INCORRECT: { name: "Incorrect", color: "#FF9999" },
		UNSURE: { name: "Unsure", color: "#FFFB99" },
		UNDO: { name: "Undo", color: "#999999" },
	});

	let tournament = "MMT 2024";
	const test_id = Number($page.params.test);
	let loaded = false;
	let switchingProblems = false;

	let user = null;

	let gradeQueue = [];
	let currentIndex = 0;

	async function fetchMoreProblems(num_problems = 5) {
		loaded = false;
		const new_problems = await fetchNewTakerResponses(
			user.id,
			num_problems,
			test_id,
			gradeQueue.at(currentIndex)?.problem_id,
		);
		if (new_problems.length > 0) {
			gradeQueue = gradeQueue.concat(new_problems);
			console.log(gradeQueue);
		}
		loaded = true;
	}

	$: (async () => {
		// TODO: @tweoss. Check if this is valid (handleAction might assume index is just 1 less)
		if (gradeQueue.length - currentIndex < 3) {
			// if (gradeQueue.length - currentIndex < 1 && user != null) {
			console.log("Fetching more problems...");
			await fetchMoreProblems();
		}
	})();

	(async () => {
		try {
			user = await getThisUser();
			console.log(user);
			loaded = true;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	})();

	function calculateDimensions(input) {
		// Parse input object
		const topLeftX = parseFloat(input.top_left[0]);
		const topLeftY = parseFloat(input.top_left[1]);
		const bottomRightX = parseFloat(input.bottom_right[0]);
		const bottomRightY = parseFloat(input.bottom_right[1]);

		// Calculate dimensions
		const left = topLeftX.toFixed(2);
		const top = topLeftY.toFixed(2);
		const width = (bottomRightX - topLeftX).toFixed(2);
		const height = (bottomRightY - topLeftY).toFixed(2);

		// Return result
		return {
			left,
			top,
			width,
			height,
		};
	}

	// Handle swipe actions
	async function handleAction(action) {
		if (switchingProblems || gradeQueue.length <= currentIndex - 1) {
			return;
		}

		// Get the reference to the body element
		const bodyElement = document.querySelector("main");

		// Define the durations for transition into flash color and back to original color (in milliseconds)
		const flashInDuration = 100; // 0.2 seconds
		const flashOutDuration = 1000; // 1 second

		if (
			[Grade.CORRECT, Grade.INCORRECT, Grade.UNSURE].find((a) => a == action) !=
			null
		) {
			await submitGrade(user.id, {
				scan_id: gradeQueue[currentIndex].scan_id,
				test_problem_id: gradeQueue[currentIndex].test_problem_id,
				grade: action.name,
			});
		}

		if (action == Grade.UNDO) {
			await undoGrade(
				gradeQueue[currentIndex - 1 >= 0 ? currentIndex - 1 : 0].grade_id
			);
		}

		// Change the background color of the entire page to the color with fast transition
		bodyElement.style.transition = `background-color ${
			flashInDuration / 1000
		}s ease-in-out`;
		bodyElement.style.backgroundColor = action.color;

		// Revert the background color to original with slower transition after the specified duration
		setTimeout(() => {
			bodyElement.style.transition = `background-color ${
				flashOutDuration / 1000
			}s ease-in-out`;
			bodyElement.style.backgroundColor = ""; // Revert to original color
		}, flashInDuration);

		// Move to the next card
		if (action == Grade.UNDO) {
			if (currentIndex > 0) {
				currentIndex -= 1;
			}
		} else {
			currentIndex += 1;
			const oldScan = gradeQueue.at(currentIndex - 1);
			const newScan = gradeQueue.at(currentIndex);
			if (
				oldScan &&
				newScan &&
				(oldScan.test_id != newScan.test_id ||
					oldScan.problem_number != newScan.problem_number)
			) {
				switchingProblems = true;
			}
		}
	}

	let card;

	async function handleKey(e) {
		// Check if the pressed key is 'X'
		if (e.key === "x" || e.key === "X") {
			await handleAction(Grade.INCORRECT);
		} else if (e.key === "z" || e.key === "Z") {
			await handleAction(Grade.UNDO);
		} else if (e.key === "c" || e.key === "C") {
			await handleAction(Grade.UNSURE);
		} else if (e.key === "v" || e.key === "V") {
			await handleAction(Grade.CORRECT);
		}
	}

	onMount(async () => {
		// Load initial card data
		console.log(`Mounting...`);
	});
</script>

<svelte:window on:keydown={handleKey} />

<div>
	<h1>Grading {tournament}</h1>

	<br />
	<Button title="Go Back" href="/grading" />
	<br /><br />
	{#if !gradeQueue[currentIndex] && !loaded}
		<Loading />
	{:else}
		<div class="card" bind:this={card}>
			{#if gradeQueue[currentIndex]}
				<div class="flex">
					<div class="sideBySide">
						<p>{gradeQueue[currentIndex].test_name}</p>
						<p style="margin-left: 20px">
							Problem #{gradeQueue[currentIndex].problem_number + 1}
						</p>
					</div>
				</div>
				<br />
				<h2>
					{gradeQueue[currentIndex].answer_latex}
				</h2>
				<ImageZoomer
					imageUrl={gradeQueue[currentIndex].image}
					inputCoordinates={calculateDimensions(gradeQueue[currentIndex])}
				/>
				<br />
				<div class="flex">
					<button
						style="background-color: #999999; color: #282828;"
						on:click={async () => handleAction(Grade.UNDO)}>↩ (Z)</button
					>
					<button
						style="background-color: #ff9999; color: #AD2828;"
						on:click={async () => handleAction(Grade.INCORRECT)}>X (X)</button
					>
					<button
						style="background-color: #FFFB99; color: #7C7215;"
						on:click={async () => handleAction(Grade.UNSURE)}>? (C)</button
					>
					<button
						style="background-color: #9BFF99; color: #157C20;"
						on:click={async () => handleAction(Grade.CORRECT)}>✔ (V)</button
					>
				</div>
				<br />
			{:else}
				<p>No more problems - check back later!</p>
			{/if}
			Number of problems remaining in queue: {gradeQueue.length - currentIndex}
		</div>
	{/if}

	<Modal
		bind:open={switchingProblems}
		modalHeading={`Switching to Problem ${
			gradeQueue.at(currentIndex)?.problem_number + 1
		}`}
		primaryButtonText="Confirm"
		secondaryButtons={[]}
		on:open
		on:close
		on:submit={() => {
			switchingProblems = false;
		}}
	>
		New Answer: {gradeQueue[currentIndex]
			? gradeQueue[currentIndex].answer_latex
			: ""}
	</Modal>
</div>

<style>
	h1 {
		margin-bottom: 5px;
	}

	.sideBySide {
		display: flex;
	}

	.card {
		width: fit-content;
		position: relative;
		border-radius: 8px;
		margin-left: auto;
		margin-right: auto;
	}

	button {
		width: 90px;
		height: 40px;
		border: 2px solid black;
		margin: 10px;
		font-size: 22px;
		border-radius: 10px;
		font-weight: bold;
	}

	button:hover {
		cursor: pointer;
	}
</style>
