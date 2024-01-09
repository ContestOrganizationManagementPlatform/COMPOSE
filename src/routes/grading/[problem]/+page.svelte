<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Button from "$lib/components/Button.svelte";
	import SwipeCard from "$lib/components/SwipeCard3.svelte";

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
	}

	onMount(() => {
		// Load initial card data
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
	<SwipeCard />
	<br />
	<div class="flex">
		<button
			style="background-color: var(--return); color: var(--return-text);"
			on:click={() => handleAction("return")}>↩</button
		>
		<button
			style="background-color: var(--incorrect); color: var(--incorrect-text);"
			on:click={() => handleAction("incorrect")}>X</button
		>
		<button
			style="background-color: var(--unsure); color: var(--unsure-text);"
			on:click={() => handleAction("unsure")}>?</button
		>
		<button
			style="background-color: var(--correct); color: var(--correct-text);"
			on:click={() => handleAction("incorrect")}>✔</button
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
		padding: 10px;
		border: 5px solid var(--primary-dark);
		border-radius: 15px;
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
