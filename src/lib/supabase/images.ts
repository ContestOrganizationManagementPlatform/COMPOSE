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
export async function uploadImage(
	file: any,
	test_id: string,
	page_number: string,
	front_id: string,
) {
	let { data, error } = await supabase.storage
		.from("scans")
		.upload(`test_${test_id}/${front_id}/page_${page_number}.png`, file, {
			upsert: true,
		});
	// // TODO: update database schema, test uploading
	// let { error } = await supabase.from("scans").upsert(
	// 	{ test_id, taker_id: front_id, page_number, scan_path: data.path },
	// 	{
	// 		onConflict: "test_id,taker_id,page_number",
	// 	},
	// );
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
