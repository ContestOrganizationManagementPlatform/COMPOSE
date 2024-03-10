<script>
	import JSZip from "jszip";
	import { uploadImage } from "$lib/supabase";

	let files;
	let processedFiles = [];

	$: if (files) {
		(async () => {
			await handleFileUpload();
		})();
	}

	async function handleFileUpload() {
		console.log(files);
		const filesToProcess = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (
				file.type === "application/zip" ||
				file.type === "application/x-zip-compressed"
			) {
				//console.log("zip found");
				filesToProcess.push(...(await unzipFile(file)));
				//console.log("zip handled");
			} else {
				filesToProcess.push(file);
				// Perform your desired action on individual processedFiles
				// For example: processFile(file);
			}
			// console.log(i); // The value of i is not increasing because it is inside an asynchronous function
		}
		for (let i = 0; i < filesToProcess.length; i++) {
			const file = filesToProcess[i];
			await uploadImage(file);
		}
	}

	async function unzipFile(zipFile) {
		const zip = new JSZip();
		const zipData = await zip.loadAsync(zipFile);
		const promises = [];

		console.log(zipData);

		zipData.forEach(async (relativePath, zipEntry) => {
			const promise = new Promise(async (resolve, reject) => {
				const extractedFileData = await zipEntry.async("arraybuffer");
				const extractedFile = new File([extractedFileData], zipEntry.name);
				console.log(extractedFile);
				resolve(extractedFile);
			});
			promises.push(promise);
		});

		return Promise.all(promises);
	}

	async function processFile(file) {
		// Presumably do something here to process the files/turn into JPEGs, etc.
		console.log("Now processing the file:", file.name);

	}
</script>

<label>
	Upload Files:
	<input type="file" multiple bind:files />
</label>

{#if processedFiles.length > 0}
	<h2>Selected processedFiles:</h2>
	{#each processedFiles as file}
		<p>{file.name} ({file.size} bytes)</p>
	{/each}
{/if}

<style>
	/* Your CSS styles here */
</style>
