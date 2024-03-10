<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	//import { Modal } from "carbon-components-svelte";
	import { Modal } from "flowbite-svelte";
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

	let tournament = "MMT 2024";
	let loaded = false;
	let open = false;

	let user;

	let gradeQueue: Array<any> = [];
	let currentIndex = 0;
	let newIndex;

	async function fetchMoreProblems(num_problems = 4) {
		loaded = false;
		const new_problems = await fetchNewTakerResponses(user.id, num_problems);
		//console.log(new_problems);
		if (new_problems.length > 0) {
			gradeQueue = gradeQueue.concat(new_problems);
			console.log(gradeQueue);
		}
		loaded = true;
	}

	$: (async () => {
		if (gradeQueue.length - currentIndex < 1) {
			console.log("Fetching more problems...");
			await fetchMoreProblems();
		}
	})();

	(async () => {
		try {
			user = await getThisUser();
			console.log(user);
			await fetchMoreProblems();
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
		if (open) {
			return;
		}
		// Get the reference to the body element
		const bodyElement = document.querySelector("main");

		// Define the durations for transition into flash color and back to original color (in milliseconds)
		const flashInDuration = 100; // 0.2 seconds
		const flashOutDuration = 1000; // 1 second

		// Define the color to flash
		let flashColor;
		switch (action) {
			case "correct":
				flashColor = "#9BFF99"; // Change to the desired color for correct action
				await submitGrade(gradeQueue[currentIndex].id, {
					scan_id: gradeQueue[currentIndex].scan_id,
					test_problem_id: gradeQueue[currentIndex].test_problem_id,
					grade: "Correct",
				});
				toast.success("Correct", {
					style:
						"border: 1px solid " +
						LightenDarkenColor("#9BFF99", -80) +
						"; padding: 16px; color:" +
						LightenDarkenColor("#9BFF99", -80) +
						";",
					iconTheme: {
						primary: LightenDarkenColor("#9BFF99", -80),
						secondary: "#FFFAEE",
					},
				});
				break;
			case "incorrect":
				flashColor = "#ff9999"; // Change to the desired color for incorrect action
				await submitGrade(gradeQueue[currentIndex].id, {
					scan_id: gradeQueue[currentIndex].scan_id,
					test_problem_id: gradeQueue[currentIndex].test_problem_id,
					grade: "Incorrect",
				});
				toast.error("Incorrect", {
					style:
						"border: 1px solid " +
						LightenDarkenColor("#ff9999", -80) +
						"; padding: 16px; color: " +
						LightenDarkenColor("#ff9999", -80) +
						";",
					iconTheme: {
						primary: LightenDarkenColor("#ff9999", -80),
						secondary: "#FFFAEE",
					},
				});
				break;
			case "unsure":
				flashColor = "#FFFB99"; // Change to the desired color for unsure action
				await submitGrade(gradeQueue[currentIndex].id, {
					scan_id: gradeQueue[currentIndex].scan_id,
					test_problem_id: gradeQueue[currentIndex].test_problem_id,
					grade: "Unsure",
				});
				toast.success("Unsure", {
					style:
						"border: 1px solid " +
						LightenDarkenColor("#fffb99", -160) +
						"; padding: 16px; color: " +
						LightenDarkenColor("#fffb99", -160) +
						";",
					icon: "?",
					iconTheme: {
						primary: LightenDarkenColor("#fffb99", -160),
						secondary: "#FFFAEE",
					},
				});
				break;
			case "return":
				flashColor = "#999999"; // Change to the desired color for return action
				await undoGrade(
					gradeQueue[currentIndex - 1 >= 0 ? currentIndex - 1 : 0].grade_id
				);
				toast.success("Undo", {
					style:
						"border: 1px solid " +
						LightenDarkenColor("#999999", -80) +
						"; padding: 16px; color: " +
						LightenDarkenColor("#999999", -80) +
						";",
					icon: "↩",
					iconTheme: {
						primary: LightenDarkenColor("#999999", -80),
						secondary: "#FFFAEE",
					},
				});
				break;
		}

		// Change the background color of the entire page to flashColor with fast transition
		if (flashColor) {
			bodyElement.style.transition = `background-color ${
				flashInDuration / 1000
			}s ease-in-out`;
			bodyElement.style.backgroundColor = flashColor;

			// Revert the background color to original with slower transition after the specified duration
			setTimeout(() => {
				bodyElement.style.transition = `background-color ${
					flashOutDuration / 1000
				}s ease-in-out`;
				bodyElement.style.backgroundColor = ""; // Revert to original color
			}, flashInDuration);
		}

		// Move to the next card
		switch (action) {
			case "return":
				currentIndex ? (newIndex = currentIndex - 1) : (newIndex = 0);
				break;
			default:
				newIndex = currentIndex + 1;
		}
		const oldScan = gradeQueue[currentIndex];
		const newScan = gradeQueue[newIndex];
		if (
			oldScan.test_id != newScan.test_id ||
			oldScan.problem_number != newScan.problem_number
		) {
			currentIndex = newIndex;
			open = true;
		}
		currentIndex = newIndex;
	}

	let card;

	async function handleKey(e) {
		// Check if the pressed key is 'X'
		if (e.key === "x" || e.key === "X") {
			await handleAction("incorrect");
		} else if (e.key === "z" || e.key === "Z") {
			await handleAction("return");
		} else if (e.key === "c" || e.key === "C") {
			await handleAction("unsure");
		} else if (e.key === "v" || e.key === "V") {
			await handleAction("correct");
		}
	}

	onMount(async () => {
		// Load initial card data
		console.log(`Mounting...`);
		// const path = './gradingImage.png'; // Replace with the path to your image
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
	{:else if !open}
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
						on:click={async () => handleAction("return")}>↩ (Z)</button
					>
					<button
						style="background-color: #ff9999; color: #AD2828;"
						on:click={async () => handleAction("incorrect")}>X (X)</button
					>
					<button
						style="background-color: #FFFB99; color: #7C7215;"
						on:click={async () => handleAction("unsure")}>? (C)</button
					>
					<button
						style="background-color: #9BFF99; color: #157C20;"
						on:click={async () => handleAction("correct")}>✔ (V)</button
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
		bind:open
		title="Switching Problems"
		on:submit={() => {
			open = false;
		}}
	>
		Switching Problems: New Answer {gradeQueue[currentIndex]
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
