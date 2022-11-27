<script>
	/* ImageManager
	 * This component allows users to upload/manage problem images.
	 * Users can create folders to store images in, as well as upload images.
	 */
	import { ImageListing, ImageBucket } from "$lib/ImageBucket";
	import { Folder, Image, ArrowLeft } from "carbon-icons-svelte";

	let curFolder = []; // array of folders
	let folderString = "/";
	let curListing = [];

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

	loadFolder();
</script>

<div class="manager-container">
	<p>Image Manager</p>

	<p>Current Folder: {folderString}</p>
	<div class="listing-container">
		{#each curListing as listing}
			<div class="listing-item" on:click={() => openItem(listing)}>
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
</style>
