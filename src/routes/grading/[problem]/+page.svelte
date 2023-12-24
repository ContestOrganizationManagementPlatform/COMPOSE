<script lang="ts">
    import { page } from "$app/stores";
	import Button from '$lib/components/Button.svelte';
    import { swipeable } from '@react2svelte/swipeable';

	let test = 'MMT 2024';
	let round = 'Team Round';
	let answer = 1024;
	let imageSrc = '/gradingImage.png';

	function onCorrect() {
		alert('Correct!');
	}

	function onIncorrect() {
		alert('Incorrect!');
	}

	function onUnsure() {
		alert('Unsure');
	}

	function onGoBack() {
		alert('Go back');
	}

	function handleKeyPress(event) {
		if (event.key === 'x') onIncorrect();
		else if (event.key === 'c') onUnsure();
		else if (event.key === 'v') onCorrect();
	}

    function handler(e) {
        if (e.detail.dir == "Left") onCorrect();
        else if (e.detail.dir == "Right") onIncorrect();
        else if (e.detail.dir == "Down") onUnsure();
    }
</script>

<svelte:window on:keydown|preventDefault={handleKeyPress} />

<div use:swipeable on:swiped={handler}>
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
	<Button title="Go Back" action={onGoBack} />
	<br /><br />
	<div class="picture">
		<img src={imageSrc} alt="Grading" />
	</div>
	<br />
	<div class="flex">
		<button
			style="background-color: #FF9999; color: #AD2828;"
			on:click={onIncorrect}>X</button
		>
		<button
			style="background-color: #FFFB99; color: #7C7215;"
			on:click={onCorrect}>?</button
		>
		<button
			style="background-color: #9BFF99; color: #157C20;"
			on:click={onUnsure}>✔</button
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
		max-width: 500px;
        width: 100%;
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
