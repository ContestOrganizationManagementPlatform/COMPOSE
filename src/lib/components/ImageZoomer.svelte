<script>
	import { onMount } from "svelte";
	import { fabric } from "fabric";

	export let imageUrl;
	export let cropCoordinates; // { x, y, width, height }

	let canvas;
	let img;

	onMount(() => {
		// Initialize Fabric canvas
		canvas = new fabric.Canvas("canvas", { selectable: false });

		// Load image onto canvas
		fabric.Image.fromURL(imageUrl, function (image) {
			img = image;

			// Add image to canvas
			canvas.add(img);

			// Set initial crop rectangle
			var cropRect = new fabric.Rect({
				left: cropCoordinates.x,
				top: cropCoordinates.y,
				width: cropCoordinates.width,
				height: cropCoordinates.height,
				fill: "transparent",
				stroke: "red",
				strokeWidth: 2,
				selectable: false, // Prevent selection of the rectangle
			});
			canvas.add(cropRect);

			// Calculate initial zoom level to fit the cropped area to the canvas
			const scaleX = canvas.width / cropCoordinates.width;
			const scaleY = canvas.height / cropCoordinates.height;
			const initialZoom = Math.min(scaleX, scaleY);

			// Set initial zoom level and center the image
			img.scale(initialZoom);
			img.center();

			// Render canvas
			canvas.renderAll();
		});
	});

	function zoomIn() {
		if (img) {
			img.scaleX *= 1.1;
			img.scaleY *= 1.1;
			canvas.renderAll();
		}
	}

	function zoomOut() {
		if (img) {
			img.scaleX *= 0.9;
			img.scaleY *= 0.9;
			canvas.renderAll();
		}
	}
</script>

<div id="canvas-container">
	<canvas id="canvas" />
</div>
<div>
	<button on:click={zoomIn}>Zoom In</button>
	<button on:click={zoomOut}>Zoom Out</button>
</div>

<style>
	#canvas-container {
		position: relative;
		width: 100%;
		height: 600px; /* You can adjust the height as needed */
	}
	#canvas {
		border: 1px solid #ccc;
	}
	button {
		margin: 5px;
	}
</style>
