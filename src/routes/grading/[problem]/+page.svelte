<script lang="ts">
	import { page } from "$app/stores";
    import { onMount } from 'svelte';
    import { swipeable } from '@react2svelte/swipeable';
    import Button from '$lib/components/Button.svelte';

    let test = 'MMT 2024';
    let round = 'Team Round';
    let answer = 1024;

    // Track the current card index
    let currentCardIndex = 0;
    let cards = [
        { image: '/gradingImage.png' },
        { image: '/logo.png' },
        { image: '/gradingImage.png' }
    ];

    function handleGoBack() {
        alert('Return prev ans');
    }

    // Handle swipe actions
    function handleSwipe(direction) {
        if (direction == "Left") { // Correct
            alert('Correct!');
        } else if (direction == "Right") { // Incorrect
            alert('Incorrect!');
        } else if (direction == "Down") { // Unsure
            alert('Unsure!');
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
    <!-- Swipeable card container with transition -->
    <div class="picture" use:swipeable on:swiped={handleSwipe} style="transform: translateX(-${currentCardIndex * 100}%)">
        {#if cards[currentCardIndex]}
            <img src={cards[currentCardIndex].image} alt="Grading" />
        {:else}
            <p>No more problems</p>
        {/if}
    </div>
    <br />
    <div class="flex">
        <button
            style="background-color: var(--return); color: var(--return-text);"
            on:click={() => handleGoBack()}
        >↩</button>
        <button
            style="background-color: var(--incorrect); color: var(--incorrect-text);"
            on:click={() => handleSwipe('left')}
        >X</button>
        <button
            style="background-color: var(--unsure); color: var(--unsure-text);"
            on:click={() => handleSwipe('right')}
        >?</button>
        <button
            style="background-color: var(--correct); color: var(--correct-text);"
            on:click={() => handleSwipe('down')}
        >✔</button>
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
        max-width: 500px;
        width: 100%;
        margin: auto;
        padding: 10px;
        border: 5px solid var(--primary-dark);
        border-radius: 15px;
        transition: transform 0.3s ease; /* Add transition for smooth movement */
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
