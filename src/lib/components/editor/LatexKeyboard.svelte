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
		onClick();
	}
</script>

{#each latexLayout as category}
	<div>
		<span>{category.name}</span>
		<div class="profileButtons">
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
