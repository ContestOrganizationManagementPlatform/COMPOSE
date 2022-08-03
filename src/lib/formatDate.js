// A standard date formatting for this project

// argument: the Date object
export function formatDate(date) {
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
	});
}
