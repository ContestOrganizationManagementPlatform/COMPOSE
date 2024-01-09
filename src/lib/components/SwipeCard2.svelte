<!-- SwipeCard.svelte -->

<script>
	let position = { x: 0, y: 0 };
	let startX, startY;
	let deltaX, deltaY;

	// New variable to store the transform property
	let transformStyle = "";

	function handleTouchStart(event) {
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	}

	function handleTouchMove(event) {
		deltaX = event.touches[0].clientX - startX;
		deltaY = event.touches[0].clientY - startY;

		position = {
			x: position.x + deltaX,
			y: position.y + deltaY,
		};

		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;

		// Update the transform style
		transformStyle = `translate(${position.x}px, ${position.y}px)`;
	}

	function handleTouchEnd() {
		// Implement logic for determining swipe direction and triggering actions
		// Example: Check deltaX and deltaY to determine if it's a left, right, up, or down swipe
		console.log(deltaX);
		console.log(deltaY);
		console.log("Swipe ended");
	}
</script>

<div
	class="swipe-card"
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	style={transformStyle}
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
