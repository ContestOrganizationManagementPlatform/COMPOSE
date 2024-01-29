<!-- StarRating.svelte -->
<script>
	import Star from "$lib/components/Star.svelte";
	export let rating;
	let ratingArray = Array.from({ length: 5 }, (_, index) => {
		const filled = (rating * 1.0) / 2 - index;
		return filled >= 1 ? 1 : filled > 0 ? filled : 0;
	});
</script>

<span class="star">
	{#each ratingArray as filled, index}
		{#if filled > 0}
			{#if filled === 1}
				<span class="full">★</span>
			{:else}
				<span class="partial" style="width: {filled * 25}%;">★</span>
			{/if}
		{:else}
			<span>★</span>
		{/if}
	{/each}
</span>
<p>{rating}</p>

<style>
	.star {
		color: #ccc; /* Default star color */

		cursor: pointer;
	}

	.full {
		color: gold; /* Filled star color */
	}

	.half {
		position: relative;
		display: inline-block;
		color: gold;
	}

	.half::before {
		content: "★";
		position: absolute;
		clip: rect(0, 0.5em, 1em, 0);
		color: #ccc;
	}

	.partial {
		color: gold;
		overflow: hidden;
		display: inline-block;
	}
</style>
