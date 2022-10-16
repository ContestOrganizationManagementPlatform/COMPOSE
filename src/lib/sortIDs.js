const nameRegex = /([A-Z]+)([0-9]+)/;
export function sortIDs(a, b) {
	let [, initA, numA] = nameRegex.exec(a);
	numA = parseInt(numA);
	let [, initB, numB] = nameRegex.exec(b);
	numB = parseInt(numB);
	if (initA != initB) return initA.localeCompare(initB);
	return numA - numB;
}
