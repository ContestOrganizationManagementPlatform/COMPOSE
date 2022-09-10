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
		let imageURL = window.URL.createObjectURL(imageFile);
		images.push({ info: img, url: imageURL, blob: imageFile });
	}

	return images;
}
