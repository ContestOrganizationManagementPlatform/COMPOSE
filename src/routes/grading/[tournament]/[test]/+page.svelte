<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import ImageZoomer from "$lib/components/ImageZoomer.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";

	import {
		getThisUser,
		fetchNewTakerResponses,
		submitGrade,
	} from "$lib/supabase";

	let test = "MMT 2024";
	let round = "Team Round";
	let answer = 1024;
	let loaded = false;

	let user;

	const imageUrl = "https://i.imgur.com/Cx9DTTZ.jpeg"; // Can be URL or file path
	const cropCoordinates = {
		x: 72.74,
		y: 236.19,
		width: 148.1,
		height: 39.6,
	};

	let gradeQueue: Array<any> = [];
	let currentCardIndex = 0;

	// let testQueue = [
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "237.6pt"],
	// 		bottom_right: ["220.95pt", "277.2pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "290.4pt"],
	// 		bottom_right: ["220.95pt", "330pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "343.2pt"],
	// 		bottom_right: ["220.95pt", "382.8pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "396pt"],
	// 		bottom_right: ["220.95pt", "435.6pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "448.8pt"],
	// 		bottom_right: ["220.95pt", "488.4pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "501.6pt"],
	// 		bottom_right: ["220.95pt", "541.2pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "554.4pt"],
	// 		bottom_right: ["220.95pt", "594pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "607.2pt"],
	// 		bottom_right: ["220.95pt", "646.8pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["72.86pt", "660pt"],
	// 		bottom_right: ["220.95pt", "699.6pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "237.6pt"],
	// 		bottom_right: ["380.05pt", "277.2pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "290.4pt"],
	// 		bottom_right: ["380.05pt", "330pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "343.2pt"],
	// 		bottom_right: ["380.05pt", "382.8pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "396pt"],
	// 		bottom_right: ["380.05pt", "435.6pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "448.8pt"],
	// 		bottom_right: ["380.05pt", "488.4pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "501.6pt"],
	// 		bottom_right: ["380.05pt", "541.2pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "554.4pt"],
	// 		bottom_right: ["380.05pt", "594pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "607.2pt"],
	// 		bottom_right: ["380.05pt", "646.8pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["231.95pt", "660pt"],
	// 		bottom_right: ["380.05pt", "699.6pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["391.05pt", "237.6pt"],
	// 		bottom_right: ["539.14pt", "277.2pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["391.05pt", "290.4pt"],
	// 		bottom_right: ["539.14pt", "330pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["391.05pt", "343.2pt"],
	// 		bottom_right: ["539.14pt", "382.8pt"],
	// 	},
	// 	{
	// 		page: 1,
	// 		top_left: ["391.05pt", "396pt"],
	// 		bottom_right: ["539.14pt", "435.6pt"],
	// 	},
	// ];

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

	async function fetchMoreProblems(num_problems = 4) {
		const new_problems = await fetchNewTakerResponses(user.id, num_problems);
		gradeQueue = gradeQueue.concat(new_problems);
	}

	$: (async () => {
		if (gradeQueue.length - currentCardIndex <= 3) {
			console.log("Fetching more problems...");
			await fetchMoreProblems();
			console.log(gradeQueue);
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

	// Track the current card index
	// let cards = [
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/logo.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/logo.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/logo.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/gradingImage.png" },
	// 	{ image: "/logo.png" },
	// 	{ image: "/gradingImage.png" },
	// ];

	// Handle swipe actions
	async function handleAction(action) {
		// Get the reference to the body element
		const bodyElement = document.querySelector("main");

		// Define the durations for transition into flash color and back to original color (in milliseconds)
		const flashInDuration = 100; // 0.2 seconds
		const flashOutDuration = 1000; // 1 second

		// Define the color to flash
		let flashColor;
		switch (action) {
			case "correct":
				flashColor = "var(--correct)"; // Change to the desired color for correct action
				await submitGrade(gradeQueue[currentCardIndex].id, {
					scan_id: gradeQueue[currentCardIndex].scan_id,
					test_problem_id: gradeQueue[currentCardIndex].test_problem_id,
					grade: "Correct",
				});
				break;
			case "incorrect":
				flashColor = "var(--incorrect)"; // Change to the desired color for incorrect action
				await submitGrade(gradeQueue[currentCardIndex].id, {
					scan_id: gradeQueue[currentCardIndex].scan_id,
					test_problem_id: gradeQueue[currentCardIndex].test_problem_id,
					grade: "Incorrect",
				});
				break;
			case "unsure":
				flashColor = "var(--unsure)"; // Change to the desired color for unsure action
				await submitGrade(gradeQueue[currentCardIndex].id, {
					scan_id: gradeQueue[currentCardIndex].scan_id,
					test_problem_id: gradeQueue[currentCardIndex].test_problem_id,
					grade: "Unsure",
				});
				break;
			case "return":
				flashColor = "var(--return)"; // Change to the desired color for return action
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
				currentCardIndex ? currentCardIndex-- : 0;
				break;
			default:
				currentCardIndex++;
		}
	}

	let position = { x: 0, y: 0 };
	let startX, startY, curX, curY;
	let isDragging = false;

	let card;

	async function handleTouchStart(event) {
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	}

	async function handleTouchMove(event) {
		event.preventDefault(); // Prevent default touch event behavior (e.g., scrolling)

		curX = event.touches[0].clientX;
		curY = event.touches[0].clientY;
		let deltaX = curX - startX;
		let deltaY = curY - startY;
		deltaX = Math.sign(deltaX) * Math.pow(Math.abs(deltaX), 1.2);
		deltaY = Math.sign(deltaY) * Math.pow(Math.abs(deltaY), 1.2);

		if (Math.abs(deltaX / deltaY) > 0.8) {
			deltaY = 0;
		} else if (Math.abs(deltaY / deltaX) > 0.8) {
			deltaX = 0;
		}

		card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

		const changeX = curX - startX;
		const changeY = curY - startY;

		if (Math.abs(changeX) >= 100 || Math.abs(changeY) >= 100) {
			card.style.opacity = `0.2`;
		} else {
			card.style.opacity = `1.0`;
		}
	}

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

	async function handleTouchEnd() {
		const changeX = curX - startX;
		const changeY = curY - startY;

		if (changeX >= 100) {
			await handleAction("correct");
		} else if (changeX <= -100) {
			await handleAction("incorrect");
		} else if (changeY >= 100) {
			await handleAction("unsure");
		} else if (changeY <= -100) {
			await handleAction("return");
		} else {
			card.style.transform = `translate(0px, 0px)`;
			card.style.opacity = `1.0`;
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
	<h1>Grade {test}</h1>
	<div class="flex">
		<div class="sideBySide">
			<p>{round}</p>
			<p style="margin-left: 20px">Problem #{currentCardIndex + 1}</p>
		</div>
	</div>
	<br />
	<h2>{answer}</h2>
	<br />
	<Button title="Go Back" href="/grading" />
	<br /><br />
	<div
		class="swipe-card"
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
		bind:this={card}
	>
		{#if gradeQueue[currentCardIndex]}
			<ImageZoomer
				imageUrl={gradeQueue[currentCardIndex].image}
				inputCoordinates={calculateDimensions(gradeQueue[currentCardIndex])}
			/>
		{:else}
			<p>No more problems</p>
		{/if}
	</div>
	<br />
	<div class="flex">
		<button
			style="background-color: var(--return); color: var(--return-text);"
			on:click={async () => handleAction("return")}>↩ (Z)</button
		>
		<button
			style="background-color: var(--incorrect); color: var(--incorrect-text);"
			on:click={async () => handleAction("incorrect")}>X (X)</button
		>
		<button
			style="background-color: var(--unsure); color: var(--unsure-text);"
			on:click={async () => handleAction("unsure")}>? (C)</button
		>
		<button
			style="background-color: var(--correct); color: var(--correct-text);"
			on:click={async () => handleAction("correct")}>✔ (V)</button
		>
	</div>
	<br />
</div>

<style>
	h1 {
		margin-bottom: 5px;
	}

	.sideBySide {
		display: flex;
	}

	.swipe-card {
		width: fit-content;
		position: relative;
		border-radius: 8px;
		transition: transform 0.2s ease-out, opacity 0.3s;
		margin-left: auto;
		margin-right: auto;
	}

	.picture {
		background-color: var(--primary-tint);
		max-width: 800px; /* Set maximum width */
		max-height: 600px; /* Set maximum height */
		width: auto; /* Ensure it takes the width of its content */
		height: auto; /* Ensure it takes the height of its content */
		padding: 10px;
		border: 5px solid var(--primary-dark);
		border-radius: 15px;
		margin: auto;
		overflow: hidden; /* Hide overflow if canvas exceeds max width or height */
	}

	img {
		width: 100%;
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
