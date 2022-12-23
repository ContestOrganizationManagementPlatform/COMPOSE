/* ImageBucket.js
 * This file exports an object that contains methods for interacting with the Supabase problem images bucket.
 */

import { supabase } from "$lib/supabaseClient";
import { ProblemImage } from "$lib/getProblemImages";
import { searchImages } from "$lib/latexStuff";

const BUCKET_NAME = "problem-images";

export class ImageListing {
	constructor({ type, name, special, folderString, raw }) {
		this.type = type; // "folder" or "image"
		this.name = name;
		this.raw = raw; // raw info from supabase listing
		this.special = special ?? ""; // used for special folders like (back)
		this.expanded = false;

		// url string of the containing folder
		this.folderString = folderString ?? "/";

		this.loadedImage = false;
		this.downloaded = null;
	}

	async download() {
		if (this.type !== "image") return null;
		if (this.loadedImage) return this.downloaded;

		const location = this.folderString + this.name;
		let { data, error } = await supabase.storage
			.from("problem-images")
			.download(location);
		if (error) throw error;

		this.downloaded = ProblemImage.fromSupabase(this.raw, data);
		this.loadedImage = true;
		return this.downloaded;
	}
}

// TODO: add proper cache to prevent having to fetch images every time

export const ImageBucket = {
	getMainFolder: async () => {
		return await ImageBucket.getFolder("");
	},
	getFolder: async (folderName) => {
		let { data, error } = await supabase.storage
			.from(BUCKET_NAME)
			.list(folderName);
		if (error) throw error;

		let listings = [];
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
		return listings;
	},
	// gets folder when it is given as a list
	getFolderFromList: async (folderList) => {
		return await ImageBucket.getFolder(folderList.join("/"));
	},
	getImage: async (url) => {
		let { data, error } = await supabase.storage.from(BUCKET_NAME).download(url);
		if (error) {
			throw new Error(error.message);
		}
		return ProblemImage.fromFile(data);
	},
	// Downloads all the images found in the given latex string.
	downloadLatexImages: async (latex) => {
		const imageList = searchImages(latex);

		let images = [];
		let errorList = [];

		// load images from supabase
		for (const imageURL of imageList) {
			let img;
			try {
				img = await ImageBucket.getImage(imageURL);
			} catch (e) {
				errorList.push({
					error: "Image failed to load: " + imageURL,
					sev: "err",
				});
				continue;
			}
			img.name = imageURL;
			images.push(img);
		}

		return {
			images,
			errorList
		}
	}
};
