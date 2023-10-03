/* ImageBucket.ts
 * This file exports an object that contains methods for interacting with the Supabase problem images bucket.
 */
import type { FileObject } from "@supabase/storage-js";
import { ProblemImage } from "$lib/getProblemImages";
import { searchImages } from "$lib/latexStuff";
import { deleteImages, downloadImagesFromPath, getImageURL, getImages, uploadImage } from "./supabase";

export type ListingType = "folder" | "image";

interface ImageListingConstructor {
	type: ListingType;
	name: string;
	special?: string;
	folderString?: string;
	raw?: FileObject;
	isFake?: boolean;
}

export class ImageListing {
	type: ListingType;
	name: string;
	raw?: FileObject;
	special: string;
	expanded: boolean;
	folderString: string;
	loadedImage: boolean;
	downloaded: ProblemImage;
	isFake: boolean;

	constructor({
		type,
		name,
		special,
		folderString,
		raw,
		isFake = false,
	}: ImageListingConstructor) {
		this.type = type; // "folder" or "image"
		this.name = name;
		this.raw = raw; // raw info from supabase listing
		this.special = special ?? ""; // used for special folders like (back)
		this.expanded = false;

		// url string of the containing folder
		this.folderString = folderString ?? "/";

		this.loadedImage = false;
		this.downloaded = null;

		this.isFake = isFake;
	}

	async download() {
		if (this.type !== "image") return null;
		if (this.loadedImage) return this.downloaded;

		const location = this.folderString + this.name;
		const data = await downloadImagesFromPath(location);

		this.downloaded = ProblemImage.fromSupabase(this.raw, data);
		this.loadedImage = true;
		return this.downloaded;
	}

	fullName() {
		return this.folderString + this.name + (this.type === "folder" ? "/" : "");
	}
}

function sortListing(lsts: ImageListing[]) {
	lsts.sort((a, b) => {
		if (a.type === b.type) {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		}
		if (a.type === "folder") return -1;
		return 1;
	});
}

// TODO: add proper cache to prevent having to fetch images every time

// list of fake folders, since folders don't actually exist until you add an image
let fakeFolderList: ImageListing[] = [];

export const ImageBucket = {
	getMainFolder: async () => {
		return await ImageBucket.getFolder("");
	},
	isFakeFolder: (path: string) => {
		return fakeFolderList.some((ff) => ff.fullName() === path);
	},
	getFolder: async (folderName: string) => {
		let listings: ImageListing[] = [];

		if (!ImageBucket.isFakeFolder(folderName + "/")) {
			const data = await getImages(folderName);

			// loop through folders/images
			for (const obj of data) {
				if (obj.id === null) {
					// is a folder
					listings.push(
						new ImageListing({
							type: "folder",
							name: obj.name,
							folderString: folderName + "/",
							raw: obj,
						})
					);
				} else {
					listings.push(
						new ImageListing({
							type: "image",
							name: obj.name,
							folderString: folderName + "/",
							raw: obj,
						})
					);
				}
			}
		}

		// find fake folders
		for (const ff of fakeFolderList) {
			if (ff.folderString === folderName + "/") {
				listings.push(ff);
			}
		}

		sortListing(listings);

		return listings;
	},
	// gets folder when it is given as a list
	getFolderFromList: async (folderList: string[]) => {
		return await ImageBucket.getFolder(folderList.join("/"));
	},
	// note: name is not set
	getImage: async (url: string) => {
		const data = await downloadImagesFromPath(url);
		return ProblemImage.fromBlob(data);
	},
	// note: imageLocation is in the form 'folder/avatar1.png'
	getImageURL: async (imageLocation: string) => {
		const data = await getImageURL(imageLocation);
		return data;
	},
	// Downloads all the images found in the given latex string.
	downloadLatexImages: async (latex: string) => {
		const imageList = searchImages(latex);

		let images = [];
		let errorList = [];

		// load images from supabase
		for (const imageURL of imageList) {
			let img: ProblemImage;
			try {
				img = await ImageBucket.getImage(imageURL.url);
				await img.loadDimensions();
			} catch (e) {
				errorList.push({
					error: "Image failed to load: " + imageURL.url,
					sev: "err",
				});
				continue;
			}
			img.name = imageURL.url;
			img.settings = imageURL.settings;
			images.push(img);
		}

		return {
			images,
			errorList,
		};
	},
	addFakeFolder(base: string, name: string) {
		fakeFolderList.push(
			new ImageListing({
				type: "folder",
				name: name,
				folderString: base,
				isFake: true,
			})
		);
	},
	addImage: async (folder: string, image: ProblemImage) => {
		if (!folder.endsWith("/")) folder += "/";
		if (!folder.startsWith("/")) folder = "/" + folder;
		const fullPath = folder + image.name;
		await uploadImage(fullPath, image.blob);

		// remove fake folders, if contained in one
		fakeFolderList = fakeFolderList.filter((ff) => {
			return !fullPath.startsWith(ff.fullName());
		});
	},
	deleteImage: async (imagePath: string) => {
		if (imagePath.startsWith("/")) imagePath = imagePath.substring(1);
		await deleteImages([imagePath]);
	},
};
