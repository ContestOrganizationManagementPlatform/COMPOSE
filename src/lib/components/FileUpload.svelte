<script>
	import JSZip from "jszip";
	import { uploadImage } from "$lib/supabase";
	import { onMount } from "svelte";
	import QrScanner from "qr-scanner";

	// When rendering to canvas, the scaling we use.
	const PDF_SCALE = 2.0;
	// Location in pts of the top right qr code
	const TEST_ID_PAGE_BOX = { left: 465, top: 14, width: 70, height: 70 };
	// Location in pts of the sticker qr code (test taker ID)
	const FRONT_ID_BOX = { left: 335, top: 130, width: 57.6, height: 57.6 };
	// How many pts to expand the bounding boxes when looking to recognize the qr codes.
	const QR_SEARCH_PADDING = 50;

	let files = [];

	$: if (files) {
		(async () => {
			await handleFileUpload();
		})();
	}

	function initializePDFJS() {
		let pdf_js_loaded = new Promise(async (resolve, reject) => {
			let counter = 0;
			function is_pdf_js_loaded() {
				if (typeof pdfjsLib !== "undefined") {
					resolve();
				} else {
					counter += 1;
					// 10 seconds later, if pdf js has not loaded, throw an error.
					if (counter > 100) {
						reject("PDF.js did not load in 10 seconds.");
					}
					// Every .1 seconds
					setTimeout(is_pdf_js_loaded, 100);
				}
			}
			is_pdf_js_loaded();
		});

		pdf_js_loaded.then(() => {
			console.log("pdf.js loaded");
			pdfjsLib.GlobalWorkerOptions.workerSrc =
				"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
		});
	}

	onMount(initializePDFJS);

	async function handleFileUpload() {
		const filesToProcess = [];
		for (const file of files) {
			if (
				file.type === "application/zip" ||
				file.type === "application/x-zip-compressed"
			) {
				filesToProcess.push(...(await unzipFile(file)));
			} else {
				filesToProcess.push(file);
			}
		}

		let pngs = (
			await Promise.all(
				filesToProcess.map(
					async (file) => await convertToPngs(await file.arrayBuffer())
				)
			)
		).flat(1);
		const expand_box = (bounding_box) => {
			const b = bounding_box;
			return {
				x: (b.left - QR_SEARCH_PADDING) * PDF_SCALE,
				y: (b.top - QR_SEARCH_PADDING) * PDF_SCALE,
				width: (b.width + 2 * QR_SEARCH_PADDING) * PDF_SCALE,
				height: (b.height + 2 * QR_SEARCH_PADDING) * PDF_SCALE,
			};
		};

		const scan_box = (png, bounding_box) => {
			return new Promise((resolve, reject) =>
				QrScanner.scanImage(png, {
					scanRegion: expand_box(bounding_box),
					returnDetailedScanResult: true,
				})
					.then(resolve)
					.catch((e) => reject(e || "No QR code found"))
			);
		};
		const scan_boxes = async (png, test_id_page_box, front_id_box) => {
			const { data: test_id_page } = await scan_box(png, test_id_page_box);
			const { data: front_id } = await scan_box(png, front_id_box);
			return [test_id_page, front_id, png];
		};

		for (const png of pngs) {
			// Try to get either the top right or the bottom left qr boxes.
			const [test_id_page, front_id, matched_png] = await Promise.any([
				scan_boxes(png[0], TEST_ID_PAGE_BOX, FRONT_ID_BOX),
				scan_boxes(png[1], TEST_ID_PAGE_BOX, FRONT_ID_BOX),
			]);

			// Assert that the test id matches a certain pattern.
			if (!test_id_page.match(/T\d+P\d+/)) {
				throw "Expected test and page id in T\\d+P\\d+ format.";
			}
			const [start, end] = test_id_page.split("P");
			const test_id = start.substr(1);
			// Convert from 1 indexed to 0 indexed.
			const page = parseInt(end) - 1;

			console.log(test_id_page, front_id);
			uploadImage(matched_png, test_id, page.toString(), front_id);
			// TODO: mark scan_path in scans table
		}
	}

	async function unzipFile(zipFile) {
		const zip = new JSZip();
		const zipData = await zip.loadAsync(zipFile);

		const fileList = [];
		zipData.forEach(async (relativePath, zipEntry) =>
			fileList.push([relativePath, zipEntry])
		);

		// Mac Finder-generated zip files contain extra __MACOSX files that are redundant.
		const extracted_files = fileList
			.filter(
				([_, zipEntry]) =>
					!zipEntry.dir &&
					!zipEntry.name.startsWith("__MACOSX") &&
					zipEntry.name.endsWith(".pdf")
			)
			.map(([_relativePath, zipEntry]) => {
				return new Promise(async (resolve, _reject) => {
					const extractedFileData = await zipEntry.async("arraybuffer");
					const extractedFile = new File([extractedFileData], zipEntry.name);
					resolve(extractedFile);
				});
			});

		return Promise.all(extracted_files);
	}

	// Returns the rendered PDF file as a blob and as rotated.
	function convertToPngs(file) {
		const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(file) });

		const convert_page_to_png = async (page, canvasdiv) => {
			const scale = 2.0;
			const viewport = page.getViewport({ scale: scale });

			const canvas = document.createElement("canvas");
			canvasdiv.appendChild(canvas);

			// Prepare canvas using PDF page dimensions
			const context = canvas.getContext("2d");
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render PDF page into canvas context
			const renderContext = { canvasContext: context, viewport: viewport };

			const renderTask = page.render(renderContext);
			const [blob, rotated_blob] = await renderTask.promise.then(async () => {
				const unrotated = await new Promise((resolve) => {
					canvas.toBlob(resolve);
				});
				context.translate(canvas.width / 2, canvas.height / 2);
				context.rotate(Math.PI);
				context.drawImage(
					context.canvas,
					0,
					0,
					canvas.width,
					canvas.height,
					-canvas.width / 2,
					-canvas.height / 2,
					canvas.width,
					canvas.height
				);

				const rotated = await new Promise((resolve) => {
					canvas.toBlob(resolve);
				});
				return [unrotated, rotated];
			});

			canvas.remove();
			return [blob, rotated_blob];
		};

		return loadingTask.promise.then(
			async (pdf) => {
				const canvas_div = document.getElementById("canvas");
				const totalPages = pdf.numPages;
				console.log(`processing ${totalPages} pages`);
				let data = [];

				for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
					let page = await pdf.getPage(pageNumber);
					data.push(await convert_page_to_png(page, canvas_div));
				}
				return data;
			},
			function (reason) {
				// PDF loading error
				console.error(reason);
			}
		);
	}
</script>

<head>
	<script
		type="module"
		src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs"
	></script>
</head>

<label>
	Upload Files:
	<input type="file" multiple bind:files accept=".pdf,.zip" />
</label>

<div id="canvas" style="display: none;" />

<style>
	/* Your CSS styles here */
</style>
