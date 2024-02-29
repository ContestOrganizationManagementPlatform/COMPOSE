<script>
	import JSZip from "jszip";

	let files = [];

	async function handleFileUpload(event) {
		const uploadedFiles = event.target.files;
		for (let i = 0; i < uploadedFiles.length; i++) {
			const file = uploadedFiles[i];
			if (file.type === "application/zip") {
				await handleZipFile(file);
			} else {
				files.push(file);
				// Perform your desired action on individual files
				// For example: processFile(file);
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

	function processFile(file) {
		// Function to process each file
		console.log("Processing file:", file.name);
	}
</script>

<label>
	Upload Files:
	<input type="file" multiple on:change={handleFileUpload} />
</label>

{#each files as file}
	<div>{file.name}</div>
{/each}

<style>
	/* Your CSS styles here */
</style>
