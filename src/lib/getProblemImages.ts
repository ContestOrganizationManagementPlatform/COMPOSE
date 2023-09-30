import type { FileObject } from "@supabase/storage-js";
import { downloadImagesFromPath, getImages } from "$lib/supabase";

class ProblemImageConstructor {
	name: string;
	type: string;
	size: number;
	blob: Blob;
	url?: string;
	settings?: string;
}

export class ProblemImage {
	name: string;
	type: string;
	size: number;
	blob: Blob;
	url: string;
	settings: string;
	dimensions?: {
		width: number;
		height: number;
	};

	constructor({
		name,
		type,
		size,
		blob,
		url,
		settings,
	}: ProblemImageConstructor) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.blob = blob;
		this.url = url ?? URL.createObjectURL(blob);
		this.settings = settings ?? "";
	}

	async loadDimensions() {
		let tempImage = new Image();
		tempImage.src = this.url;
		await tempImage.decode();
		this.dimensions = {
			width: tempImage.naturalWidth,
			height: tempImage.naturalHeight,
		};
	}

	getDimensions() {
		if (!this.dimensions) throw "Dimensions not yet initialized";
		return this.dimensions;
	}

	// sets name to empty
	static fromBlob(blob: Blob) {
		return new ProblemImage({
			name: "",
			type: blob.type,
			size: blob.size,
			blob,
		});
	}

	static fromFile(file: File) {
		return new ProblemImage({
			name: file.name,
			type: file.type,
			size: file.size,
			blob: file,
		});
	}

	// takes info from list(), blob from download()
	static fromSupabase(info: FileObject, blob: Blob) {
		return new ProblemImage({
			name: info.name,
			type: blob.type,
			size: blob.size,
			blob: blob,
		});
	}

	toFile() {
		return new File([this.blob], this.name, { type: this.type });
	}
}

export async function getProblemImages(
	problem_id: number
) {
	try {
		let images = [];

		const fileList = await getImages(`pb${problem_id}/problem`);
		for (const img of fileList) {
			const imageFile = await downloadImagesFromPath(`pb${problem_id}/problem/${img.name}`);
			images.push(ProblemImage.fromSupabase(img, imageFile));
		}

		return images;
	} catch (error) {
		throw error;
	}
}
