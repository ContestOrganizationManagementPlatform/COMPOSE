<!-- SwipeCard.svelte -->

<script>
	let position = { x: 0, y: 0 };
	let startX, startY, curX, curY, deltaX, deltaY;
	let isDragging = false;

	let card;

	function handleTouchStart(event) {
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
		curX = event.touches[0].clientX;
		curY = event.touches[0].clientY;
		isDragging = true;
	}

	function handleTouchMove(event) {
		event.preventDefault(); // Prevent default touch event behavior (e.g., scrolling)

		if (!isDragging) return;

		deltaX = event.touches[0].clientX - curX;
		deltaY = event.touches[0].clientY - curY;

		position = {
			x: position.x + deltaX,
			y: position.y + deltaY,
		};

		curX = event.touches[0].clientX;
		curY = event.touches[0].clientY;
	}

	function handleTouchEnd() {
		if (isDragging) {
			isDragging = false;
			const changeX = position.x - startX;
			const changeY = position.y - startY;
			// Implement logic for determining swipe direction and triggering actions
			// Example: Check deltaX and deltaY to determine if it's a left, right, up, or down swipe
			console.log("(" + changeX + "," + changeY + ")");
		}
	}

	$: if (card)
		card.style.transform = `translate(${position.x}px, ${position.y}px)`;
</script>

<div
	class="swipe-card"
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	bind:this={card}
>
	<!-- Your card content goes here -->
	<div class="card-content">Card Content</div>
</div>

<style>
	.swipe-card {
		position: relative;
		width: 300px;
		height: 400px;
		background-color: #f0f0f0;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease-out;
	}

	.card-content {
		padding: 16px;
	}
</style>
