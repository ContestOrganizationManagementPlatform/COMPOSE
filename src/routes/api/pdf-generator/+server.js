import latex from "node-latex";
import fs from "vite-plugin-fs";
import { createHash } from "crypto";

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
}; // unfortunately this only works for commands with exactly one parameter for now

export async function GET({ request, response }) {
	try {
		const og_latex = new URL(request.url).searchParams.get("latex");
		let preamble = "";
		const keys = Object.keys(macros);
		for (var key of keys) {
			preamble += "\\newcommand{" + key + "}[1]{" + macros[key] + "}";
		}
		console.log(preamble);

		const text_latex =
			"\\documentclass{article}\n\\usepackage[utf8]{inputenc}\\usepackage{amsmath,amsfonts,amssymb}\\usepackage[margin=1in]{geometry}" +
			preamble +
			og_latex;
		const hash = createHash("sha256").update(text_latex).digest("hex");

		fs.writeFile(
			"./src/routes/api/pdf-generator/tex-files/" + hash + ".tex",
			text_latex,
			function (err) {
				if (err) {
					console.log(err.message);
					throw err;
				}
				console.log("Saved tex file!");
			}
		);

		const input = fs.createReadStream(
			"./src/routes/api/pdf-generator/tex-files/" + hash + ".tex"
		);
		const output = fs.createWriteStream(
			"./src/routes/api/pdf-generator/tex-pdfs/" + hash + ".pdf"
		);
		const pdf = latex(input);

		pdf.pipe(output);
		pdf.on("error", (err) => {
			console.log(err.message);
			throw err;
		});
		pdf.on("finish", () => console.log("PDF generated!"));

		const finalPdf = fs.readFileSync(
			"./src/routes/api/pdf-generator/tex-pdfs/" + hash + ".pdf"
		);

		return new Response(finalPdf, {
			status: 200,
			statusText: "Worked",
			headers: {
				"Content-type": "application/pdf",
				"Content-Disposition": "attachment; filename=" + hash + ".pdf",
			},
		});
	} catch (e) {
		console.log(e);
		return new Response("Error", {
			status: 500,
		});
	}
}

export async function DELETE({ request, response }) {
	try {
		const body = await request.json();
		const hash = body.hash;

		fs.unlink(
			"./src/routes/api/pdf-generator/tex-files/" + hash + ".tex",
			function (err) {
				if (err) throw err;
				console.log("Tex file deleted!");
			}
		);
		fs.unlink(
			"./src/routes/api/pdf-generator/tex-pdfs/" + hash + ".pdf",
			function (err) {
				if (err) throw err;
				console.log("File deleted!");
			}
		);

		return Response("Files deleted successfully!", {
			status: 200,
		});
	} catch (e) {
		return Response("Something went wrong...", {
			status: 400,
		});
	}
}
