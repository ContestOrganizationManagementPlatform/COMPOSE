<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Button from "$lib/components/Button.svelte";

	let test = "MMT 2024";
	let round = "Team Round";
	let answer = 1024;

	// Track the current card index
	let currentCardIndex = 0;
	let cards = [
		{ image: "/gradingImage.png" },
		{ image: "/logo.png" },
		{ image: "/gradingImage.png" },
		{ image: "/gradingImage.png" },
		{ image: "/logo.png" },
		{ image: "/gradingImage.png" },
		{ image: "/gradingImage.png" },
		{ image: "/logo.png" },
		{ image: "/gradingImage.png" },
		{ image: "/gradingImage.png" },
		{ image: "/logo.png" },
		{ image: "/gradingImage.png" },
	];

	// Handle swipe actions
	function handleAction(action: string) {
		if (action === "correct") {
			alert("Correct!");
		} else if (action === "incorrect") {
			alert("Incorrect!");
		} else if (action === "unsure") {
			alert("Unsure!");
		} else if (action == "return") {
			alert("Return prev ans");
		}

		// Move to the next card
		currentCardIndex++;
		card.style.transition = `none`; // Disable transitions
		card.style.transform = `translate(0px, 0px)`;
		card.style.opacity = `1.0`;
		card.offsetHeight; // Trigger a reflow, flushing the CSS changes
		card.style.transition = ``;
	}

	let position = { x: 0, y: 0 };
	let startX, startY, curX, curY;
	let isDragging = false;

	let card;

	function handleTouchStart(event) {
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	}

	function handleTouchMove(event) {
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
	
		card.style.transform = `translate(${deltaX}px, ${deltaY}px)`

		const changeX = curX - startX;
		const changeY = curY - startY;

		if (Math.abs(changeX) >= 100 || Math.abs(changeY) >= 100) {
			card.style.opacity = `0.2`;
		} else {
			card.style.opacity = `1.0`
		}
	}

	function handleKey(e) {
		// Check if the pressed key is 'X'
		if (e.key === 'x' || e.key === 'X') {
			handleAction("incorrect");
		} else if (e.key === 'z' || e.key === 'Z') {
			handleAction("return");
		} else if (e.key === 'c' || e.key === 'C') {
			handleAction("unsure");
		} else if (e.key === 'v' || e.key === 'V') {
			handleAction("correct");
		}
	}

	function handleTouchEnd() {
			const changeX = curX - startX;
			const changeY = curY - startY;

			if (changeX >= 100) {
				handleAction("correct");
			} else if (changeX <= -100) {
				handleAction("incorrect");
			} else if (changeY >= 100) {
				handleAction("unsure");
			} else if (changeY <= -100) {
				handleAction("return");
			} else {
				card.style.transform = `translate(0px, 0px)`
				card.style.opacity = `1.0`
			}
	}

	onMount(() => {
		// Load initial card data
	});
</script>

<svelte:window on:keydown={handleKey} />

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
	<div
		class="swipe-card"
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
		bind:this={card}
	>
		<div class="picture">
			{#if cards[currentCardIndex]}
				<div class="box unselectable flex"><img src={cards[currentCardIndex].image} alt="Grading" /></div>
			{:else}
				<p>No more problems</p>
			{/if}
		</div>
	</div>
	<br />
	<div class="flex">
		<button
			style="background-color: var(--return); color: var(--return-text);"
			on:click={() => handleAction("return")}>↩ (Z)</button
		>
		<button
			style="background-color: var(--incorrect); color: var(--incorrect-text);"
			on:click={() => handleAction("incorrect")}>X (X)</button
		>
		<button
			style="background-color: var(--unsure); color: var(--unsure-text);"
			on:click={() => handleAction("unsure")}>? (C)</button
		>
		<button
			style="background-color: var(--correct); color: var(--correct-text);"
			on:click={() => handleAction("incorrect")}>✔ (V)</button
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
		min-width: 300px;
		max-width: 600px;
		width: 80%;
		padding: 10px;
		border: 5px solid var(--primary-dark);
		border-radius: 15px;
		margin: auto;
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
