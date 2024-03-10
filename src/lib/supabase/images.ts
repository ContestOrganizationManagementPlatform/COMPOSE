import { supabase } from "../supabaseClient";



/**
 * Fetches image from path
 *
 * @param path string
 * @returns images
 */
export async function getImages(path: string) {
	const { data, error } = await supabase.storage
		.from("problem-images")
		.list(path);
	if (error) throw error;
	return data;
}

/**
 * Download all images
 *
 * @param path string
 * @returns downloadableFiles
 */
export async function downloadImagesFromPath(path: string) {
	const { data: imageX, error } = await supabase.storage
		.from("problem-images")
		.download(path);
	if (error) throw error;
	return imageX;
}

/**
 * Delete a problem's image. Returns nothing.
 *
 * @param filePaths string[]
 */
export async function deleteImages(filePaths: string[]) {
	const { error } = await supabase.storage
		.from("problem-images")
		.remove(filePaths);
	if (error) throw error;
}

/**
 * Upload an image to the image database. Returns nothing.
 *
 * @param filePath string
 * @param file
 * @param upsert optional, boolean
 */
export async function uploadImage(file: any) {
	console.log(file);

	let { error } = await supabase.storage
		.from("scans")
		.upload('test_1/test-file.jpg', file, {
			upsert: true,
		  });
	if (error) throw error;
}

/**
 * Get an image URL
 *
 * @param filePath string
 * @returns the image's public URL
 */
export async function getImageURL(filePath: string) {
	let { data, error } = await supabase.storage
		.from("problem-images")
		.getPublicUrl(filePath);
	if (error) throw error;
	
	return data.publicURL;
}
