<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	let card;
	let hammer;
	export let action;

	onMount(() => {
		// Check if we're running in a browser environment before initializing Hammer
		if (typeof window !== 'undefined') {
			import('hammerjs').then((module) => {
				const Hammer = module.default;
				hammer = new Hammer(card);

				hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

				hammer.on("swiperight swipeleft swipeup swipedown", handleSwipe);
			});
		}

		return () => {
			if (hammer) {
				hammer.destroy();
			}
		};
	});

	onDestroy(() => {
		if (hammer) {
			hammer.destroy();
		}
	});

	function handleSwipe(event) {
		const direction = event.direction;

		// Add a class to trigger the CSS transition based on the swipe direction
		card.classList.add(`swipe-${direction}`);

		// Trigger the action after a delay to allow the transition to complete
		setTimeout(() => {
			switch (direction) {
				case Hammer.DIRECTION_LEFT:
					action("incorrect");
					break;
				case Hammer.DIRECTION_RIGHT:
					action("correct");
					break;
				case Hammer.DIRECTION_UP:
					action("unsure");
					break;
				case Hammer.DIRECTION_DOWN:
					action("return");
					break;
				default:
					break;
			}

			// Remove the swipe class to reset the card position
			card.classList.remove(`swipe-${direction}`);
		}, 300); // Adjust the delay based on your transition duration
	}
</script>

<style>
	/* Add your card styles here */
	:host {
		display: block;
	}

	.transition {
		transition: transform 0.3s ease-in-out;
		animation-duration: 0.3s;
		animation-fill-mode: forwards;
	}

	@keyframes swipe-right {
		to {
			transform: translateX(200px);
		}
	}

	@keyframes swipe-left {
		to {
			transform: translateX(-100%);
		}
	}

	@keyframes swipe-up {
		to {
			transform: translateY(-100%);
		}
	}

	@keyframes swipe-down {
		to {
			transform: translateY(100%);
		}
	}

	.swipe-right {
		animation-name: swipe-right;
	}

	.swipe-left {
		animation-name: swipe-left;
	}

	.swipe-up {
		animation-name: swipe-up;
	}

	.swipe-down {
		animation-name: swipe-down;
	}
</style>

<div bind:this={card} class="transition">
	<slot></slot>
</div>
