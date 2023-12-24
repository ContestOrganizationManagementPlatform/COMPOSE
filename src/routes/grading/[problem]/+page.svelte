<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import { afterUpdate } from "svelte";

	let test = "MMT 2024";
	let round = "Team Round";
	let answer = 1024;

	let pictureStyle = {
		left: 0,
		top: 0,
	};

	let isDragging = false;
	let initialX = 0;
	let initialY = 0;

	function handleMouseDown(event) {
		isDragging = true;
		initialX = event.clientX - pictureStyle.left;
		initialY = event.clientY - pictureStyle.top;
	}

	function handleMouseMove(event) {
		if (isDragging) {
			pictureStyle.left = event.clientX - initialX;
			pictureStyle.top = event.clientY - initialY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Track whether the function has been called
	let functionCalled = false;

	// Track the current card index
	let currentCardIndex = 0;
	let cards = [
		{ image: "/gradingImage.png" },
		{ image: "/logo.png" },
		{ image: "/gradingImage.png" },
	];

	function handleGoBack() {
		alert("Return prev ans");
	}

	// Handle swipe actions
	function handleSwipe(direction) {
		if (direction === "left") {
			// Correct
			alert("Correct!");
		} else if (direction === "right") {
			// Incorrect
			alert("Incorrect!");
		} else if (direction === "down") {
			// Unsure
			alert("Unsure!");
		}

		// Move to the next card
		currentCardIndex++;
	}

	onMount(() => {
		// Load initial card data
	});

	afterUpdate(() => {
		if (pictureStyle.left >= 100 && !functionCalled) {
			// Run your function here
			handleSwipe("left");
			functionCalled = true;
		}
		if (pictureStyle.left <= -300 && !functionCalled) {
			// Run your function here
			handleSwipe("right");
			functionCalled = true;
		}
		if (pictureStyle.top >= 300 && !functionCalled) {
			// Run your function here
			handleSwipe("down");
			functionCalled = true;
		}
	});
</script>

<div>
	<h1>Grade {test}</h1>
	<div class="flex">
		<div class="sideBySide">
			<p>{round}</p>
			<p style="margin-left: 20px">Problem #{$page.params.problem}</p>
		</div>
	</div>
	<br />
	<h2>{answer}</h2>
	<br />
	<Button title="Go Back" href="/grading" />
	<br /><br />
	<!-- Swipeable card container with transition -->
	<div class="picture">
		{#if cards[currentCardIndex]}
			<img
				src={cards[currentCardIndex].image}
				alt="Grading"
				style="left: {pictureStyle.left}px; top: {pictureStyle.top}px;"
				on:mousedown={handleMouseDown}
				on:mousemove={handleMouseMove}
				on:mouseup={handleMouseUp}
				on:mouseleave={handleMouseUp}
			/>
		{:else}
			<p>No more problems</p>
		{/if}
	</div>
	<br />
	<div class="flex">
		<button
			style="background-color: var(--return); color: var(--return-text);"
			on:click={() => handleGoBack()}>↩</button
		>
		<button
			style="background-color: var(--incorrect); color: var(--incorrect-text);"
			on:click={() => handleSwipe("right")}>X</button
		>
		<button
			style="background-color: var(--unsure); color: var(--unsure-text);"
			on:click={() => handleSwipe("down")}>?</button
		>
		<button
			style="background-color: var(--correct); color: var(--correct-text);"
			on:click={() => handleSwipe("left")}>✔</button
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

	.picture {
		background-color: var(--primary-tint);
		min-width: 300px;
		max-width: 600px;
		width: 80%;
		margin: auto;
		padding: 20px;
		border: 5px solid var(--primary-dark);
		border-radius: 15px;
	}

	img {
		width: 100%;
		z-index: 100;
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
