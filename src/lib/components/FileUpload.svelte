<script>
	import JSZip from "jszip";
	import pdfjsLib from "pdfjs-dist";

	export let splitPdf = false;

	let files;

	$: if (files) {
		// Note that `files` is of type `FileList`, not an Array:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileList
		console.log(files);

		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`);
		}
	}

	async function handleFileUpload(event) {
		console.log("FILE UPLOAD");
		console.log(event);
		const uploadedFiles = event.target.files;
		for (let i = 0; i < uploadedFiles.length; i++) {
			const file = uploadedFiles[i];
			if (file.type === "application/zip") {
				await handleZipFile(file);
			} else if (file.type === "application/pdf" && splitPdf) {
				await handlePdfFile(file);
			} else {
				files.push(file);
				processFile(file);
			}
		}
	}

	async function handleZipFile(zipFile) {
		const zip = new JSZip();
		const zipData = await zip.loadAsync(zipFile);
		const extractedFiles = [];

		zipData.forEach(async (relativePath, zipEntry) => {
			const extractedFileData = await zipEntry.async("arraybuffer");
			const extractedFile = new File([extractedFileData], zipEntry.name);
			extractedFiles.push(extractedFile);
			// Perform your desired action on each extracted file
			// For example: processFile(extractedFile);
		});

		files = [...files, ...extractedFiles];
	}

	async function handlePdfFile(pdfFile) {
		const pdfData = await pdfjsLib.getDocument(pdfFile).promise;
		const numPages = pdfData.numPages;

		for (let i = 1; i <= numPages; i++) {
			const page = await pdfData.getPage(i);
			const pageData = await page.getOperatorList();
			const singlePagePdfData = new Uint8Array(await pageData.stream.bytes);
			const singlePagePdfFile = new File(
				[singlePagePdfData],
				`${pdfFile.name}_page_${i}.pdf`
			);
			files.push(singlePagePdfFile);
			// Perform your desired action on each single page PDF
			// For example: processFile(singlePagePdfFile);
		}
	}

	function processFile(file) {
		// Function to process each file
		console.log("Processing file:", file.name);
	}
</script>

<label>
	Upload Files:
	<input
		type="file"
		multiple
		bind:files
		on:change={(e) => {
			console.log("ONCHANGE");
			handleFileUpload(e);
		}}
	/>
</label>

{#each files as file}
	<div>{file.name}</div>
{/each}

<style>
	/* Your CSS styles here */
</style>
