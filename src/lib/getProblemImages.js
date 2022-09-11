export class ProblemImage {
	constructor({ name, type, size, blob, url }) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.blob = blob;
		this.url = url ?? URL.createObjectURL(blob);
	}

	static fromFile(file) {
		return new ProblemImage({
			name: file.name,
			type: file.type,
			size: file.size,
			blob: file,
		});
	}

	// takes info from list(), blob from download()
	static fromSupabase(info, blob) {
		return new ProblemImage({
			name: info.name,
			type: info.metadata.mimetype,
			size: info.metadata.size,
			blob: blob,
		});
	}

	toFile() {
		return new File([this.blob], this.name, { type: this.type });
	}
}

export async function getProblemImages(supabase, problem_id) {
	let images = [];

	const { data: fileList, error } = await supabase.storage
		.from("problem-images")
		.list(`pb${problem_id}/problem`);
	if (error) alert(error.message);

	for (const img of fileList) {
		const { data: imageFile, error2 } = await supabase.storage
			.from("problem-images")
			.download(`pb${problem_id}/problem/${img.name}`);
		if (error2) alert(error2.message);
		images.push(ProblemImage.fromSupabase(img, imageFile));
	}

	return images;
}
