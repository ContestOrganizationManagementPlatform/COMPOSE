// A standard date formatting for this project

// argument: the Date object
export function formatDate(date) {
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	});
}

// Pads left of str with 0s until it is length len
function padZeros(str, len) {
	str = str.toString();
	const lenDiff = len - str.length;
	if (lenDiff <= 0) return str;
	return "0".repeat(lenDiff) + str;
}

// argument: milliseconds elapsed, display options
export function formatTime(ms, options) {
	const { showMilliseconds, hideHours } = options ?? {};

	let ms1 = ms % 1000;
	let secs = Math.floor(ms / 1000) % 60;
	const minutes = Math.floor(ms / (60 * 1000)) % 60;
	const hours = Math.floor(ms / (3600 * 1000));

	let output = "";
	if (!hideHours) {
		output += `${hours}:${padZeros(minutes, 2)}`;
	} else {
		output += `${minutes}`;
	}
	output += `:${padZeros(secs, 2)}`;
	if (showMilliseconds) {
		output += `.${padZeros(ms1, 3)}`;
	}

	return output;
}
