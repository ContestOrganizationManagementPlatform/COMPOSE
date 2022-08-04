<script>
	import { latexLayout } from "$lib/latexKeyboardLayout.js";
	import KeyboardButton from "$lib/components/editor/KeyboardButton.svelte";

	export let onClick = () => {};

	function handleClick(beforeText, afterText) {
		let el = document.activeElement;
		if (el.nodeName !== "TEXTAREA") return;

		if (el.selectionStart || el.selectionStart == "0") {
			const sp = el.selectionStart;
			const ep = el.selectionEnd;
			el.value =
				el.value.substring(0, sp) +
				beforeText +
				el.value.substring(sp, ep) +
				afterText +
				el.value.substring(ep);
			el.selectionStart = sp + beforeText.length;
			el.selectionEnd = ep + beforeText.length;
		}

		el.dispatchEvent(new Event("input")); // make it update
		onClick();
	}
</script>

<div class="latexKeyboard">
	{#each latexLayout as category}
		<div class="keyboardCategory">
			<div class="profileButtons">
				<span class="categoryName">{category.name}</span>
				{#each category.buttons as button}
					<KeyboardButton
						beforeText={button[0]}
						afterText={button[1]}
						displayText={button[2]}
						clickHandler={handleClick}
					/>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.latexKeyboard {
		background-color: rgb(219, 248, 229);
		border: 1px solid #333333;
		display: block;
		padding: 10px;
		overflow-y: auto;
	}

	.keyboardCategory {
		width: 100%;
		margin-bottom: 10px;
	}

	.categoryName {
		vertical-align: middle;
	}
</style>
