import katex from "katex";
import type { ProblemImage } from "./getProblemImages";
import { processLatexViaUnified } from "@unified-latex/unified-latex";
import { unifiedLatexToHast } from "@unified-latex/unified-latex-to-hast";
import rehypeStringify from "rehype-stringify";

const allowedControls = [
	"\\image",
	"\\includegraphics",
	"\\textbf",
	"\\underline",
	"\\textit",
	"\\emph",
];

// needs to open with c1 and close with c2
// returns 0 if no mismatch, 1 if left open, -1 if premature close
function checkMismatch(str, c1, c2, ignoreBackslash) {
	let depth = 0,
		skip = false,
		lastC1 = 0;
	for (let i = 0; i < str.length; i++) {
		if (skip) {
			skip = false;
			continue;
		}

		if (str[i] === "\\" && ignoreBackslash) {
			skip = true;
		} else if (str[i] === c2) {
			depth--;
		} else if (str[i] === c1) {
			depth++;
			lastC1 = i;
		}

		if (depth < 0) {
			return {
				err: -1,
				ind: i,
			};
		}
	}

	return {
		err: depth > 0 ? 1 : 0,
		ind: depth > 0 ? lastC1 : -1,
	};
}

export function checkLatex(str, field) {
	return []; // defunct
}

const imageRegex = /\\(?:image|includegraphics)(?:\[(.*?)\])?\{(.+?)\}/g;

// Returns the list of image URLs found in the string
export function searchImages(str) {
	return [...str.matchAll(imageRegex)].map((x, i) => ({
		settings: x[1],
		url: x[2],
		index: i,
	})); // only want capturing groups
}

const macros = {
	"\\ans": "\\boxed{#1}",
	"\\Abs": "\\left\\lVert #1 \\right\\rVert",
	"\\ang": "\\left \\langle #1 \\right \\rangle",
	"\\set": "\\left\\{#1\\right\\}",
	"\\paren": "\\left(#1\\right)",
	"\\floor": "\\left\\lfloor #1 \\right\\rfloor",
	"\\ceil": "\\left\\lceil #1 \\right\\rceil",
	"\\VEC": "\\overrightarrow{#1}",
	"\\Mod": "\\enspace(\\text{mod}\\ #1)",
};

const settingsRegex = {
	scale: /scale=((?:\d|\.)+)/,
};

const processor = processLatexViaUnified()
	.use(unifiedLatexToHast)
	.use(rehypeStringify);

// workaround to make images not get parsed
const placeholderText = "PARSETHISIMAGELATER6358272";
const placeholderEnd = "ENDPLACEHOLDER671384256";
const placeholderRegex =
	/PARSETHISIMAGELATER6358272(.*?)ENDPLACEHOLDER671384256/g;

export async function displayLatex(str: string, images: ProblemImage[]) {
	let errorList = [];

	str = str.replaceAll(imageRegex, (_m, _settings, imageName) => {
		return placeholderText + imageName + placeholderEnd;
	});

	let unifiedStr = str;
	try {
		unifiedStr = processor.processSync(str).value as string;
	} catch (e) {
		errorList.push({
			error: e.toString(),
			sev: "err",
		});
	}

	let fakeElem = document.createElement("div");
	fakeElem.innerHTML = unifiedStr;
	try {
		// @ts-ignore
		window.renderMathInElement(fakeElem, {
			delimiters: [
				{ left: "$$", right: "$$", display: true },
				{ left: "\\[", right: "\\]", display: true },
				{ left: "$", right: "$", display: false },
				{ left: "\\(", right: "\\)", display: false },
			],
			macros: macros,
			throwOnError: true,
		});
	} catch (e) {
		errorList.push({
			error: e.toString(),
			sev: "warn",
		});
	}

	// replace math
	for (const dm of Array.from(fakeElem.querySelectorAll(".display-math"))) {
		try {
			katex.render(dm.textContent, dm, {
				displayMode: true,
				throwOnError: true,
				macros,
			});
		} catch (e) {
			errorList.push({
				error: e.toString(),
				sev: "warn",
			});
		}
	}
	for (const im of Array.from(fakeElem.querySelectorAll(".inline-math"))) {
		try {
			katex.render(im.textContent, im, {
				displayMode: false,
				throwOnError: true,
				macros,
			});
		} catch (e) {
			errorList.push({
				error: e.toString(),
				sev: "warn",
			});
		}
	}

	let outHtml = fakeElem.innerHTML;

	// insert images
	outHtml = outHtml.replaceAll(placeholderRegex, (_m, imageName) => {
		let image = images.find((img) => img.name === imageName);
		let out = "";
		if (!image) {
			errorList.push({
				error: "No image named " + imageName,
				sev: "warn",
			});
		} else {
			let scaleSetting = image.settings?.match(settingsRegex.scale) ?? [
				"",
				"1",
			];
			let percentage = Math.floor(parseFloat(scaleSetting[1]) * 100);
			let dims = image.getDimensions();
			dims.width *= percentage / 100;
			out = `<img src='${image.url}' alt='${imageName}' style="width: ${dims.width}px; height: auto;" />`;
		}
		return out;
	});

	return {
		out: outHtml,
		errorList,
	};
}
