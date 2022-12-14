<script>
	/* ImageManager
	 * This component allows users to upload/manage problem images.
	 * Users can create folders to store images in, as well as upload images.
	 */
	import { ImageListing, ImageBucket } from "$lib/ImageBucket";
	import { Folder, Image, ArrowLeft } from "carbon-icons-svelte";
	import { FileUploader } from "carbon-components-svelte";

	const MAX_IMAGE_SIZE = 1024 * 1024;
	const MAX_IMAGE_SIZE_READABLE = "1 mb";

	let curFolder = []; // array of folders
	let folderString = "/";
	let curListing = [];

	let fileUploader;

	async function loadFolder() {
		curListing = await ImageBucket.getFolderFromList(curFolder);
		if (curFolder.length > 0) {
			curListing = [
				new ImageListing({ type: "folder", name: "(back)", special: "back" }),
				...curListing,
			];
		}
	}

	async function openItem(listing) {
		if (listing.type === "folder") {
			if (listing.special === "back") {
				curFolder.pop();
				curFolder = curFolder;
			} else {
				curFolder = [...curFolder, listing.name];
			}
			await loadFolder();
			// only update after folder has loaded
			folderString = curFolder.join("/") + "/";
		} else if (listing.type === "image") {
			listing.expanded = !listing.expanded;
			curListing = curListing;
		}
	}

	async function addImage(e) {
		const images = e.detail;
		console.log(images);

		for (const img of images) {
			if (img.size > MAX_IMAGE_SIZE) {
				cancelUpload(
					`Image ${img.name} is too large (${MAX_IMAGE_SIZE_READABLE} max)`
				);
				return;
			}
		}
	}

	let showUploadError = false;
	let uploadError = "";

	// clear and cancel file upload
	function cancelUpload(reason) {
		fileUploader.clearFiles();
		uploadError = reason;
		showUploadError = true;
	}

	loadFolder();
</script>

<div class="manager-container">
	<p>Image Manager</p>

	<p>Current Folder: {folderString}</p>
	<div class="listing-container">
		{#each curListing as listing}
			<div class="listing-item" on:click={() => openItem(listing)} on:keydown={() => openItem(listing)}>
				{#if listing.special === "back"}
					<ArrowLeft />
				{:else if listing.type === "folder"}
					<Folder />
				{:else}
					<Image />
				{/if}
				{listing.name}

				{#if listing.expanded}
					<div class="listing-expanded">
						{#await listing.download()}
							<p>Loading image...</p>
						{:then img}
							<img src={img.url} alt="Attached for problem" />
						{/await}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div>
		<FileUploader
			multiple
			buttonLabel="Upload files"
			labelDescription={`Accepts png, jpg, jpeg, webp. ${MAX_IMAGE_SIZE_READABLE} max each (but please try and use smaller images). To use in the problem, use \image{<image file path>}`}
			accept={[".jpg", ".png", ".jpeg", ".webp"]}
			status="edit"
			bind:this={fileUploader}
			on:add={addImage}
		/>
		{#if showUploadError}
			<p class="error-p">Error: {uploadError}</p>
		{/if}
	</div>
</div>

<style>
	.manager-container {
		border: 1px solid black;
		text-align: left;
		padding: 5px;
	}

	.listing-container {
		margin-top: 5px;
	}

	.listing-item {
		border: 1px solid black;
		margin-bottom: 3px;
		padding: 3px;
		vertical-align: middle;
		width: auto;
		background-color: var(--white);
		cursor: pointer;
	}

	.listing-item:hover {
		background-color: lightgray;
	}

	.listing-expanded {
		margin: 5px;
	}

	.error-p {
		color: #aa0000;
	}
</style>
