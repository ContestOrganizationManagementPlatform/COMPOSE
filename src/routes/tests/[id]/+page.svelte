<script lang="ts">
	import { page } from "$app/stores";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { Loading, Checkbox } from "carbon-components-svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		getImages,
		getTestInfo,
		getTestProblems,
		getThisUser,
		getThisUserRole,
	} from "$lib/supabase";
	import QRCode from "qrcode";
	import compilerPath from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
	import rendererPath from "@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url";
	import { $typst as Typst } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
	import { ImageBucket } from "$lib/ImageBucket";
	import type { ProblemImage } from "$lib/getProblemImages";
	import answerSheet from "./answer_sheet.typ?url";

	Typst.setRendererInitOptions({ getModule: () => rendererPath });
	Typst.setCompilerInitOptions({ getModule: () => compilerPath });

	let testId = Number($page.params.id);
	let test;
	let testCoordinators = [];
	let loading = true;
	let loadingProblems = true;
	let problems = [];
	let userIsTestCoordinator = false;

	let feedback = [];

	let openModal = false;
	let values = [
		"Problems",
		"Problem ID",
		"Answers",
		"Solutions",
		"Comments",
		"Feedback",
	];
	let group = values.slice(0, 1);

	async function getTest() {
		try {
			test = await getTestInfo(
				testId,
				"*,test_coordinators(users(*)),tournaments(tournament_name),testsolves(test_id,id)"
			);
			testCoordinators = test.test_coordinators.map((x) => x.users);
			userIsTestCoordinator =
				!!testCoordinators.find(
					async (tc) => tc.id === (await getThisUser()).id
				) || (await getThisUserRole()) >= 40;
			getProblems();
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	//Look a comment
	async function getProblems() {
		try {
			let problemList = await getTestProblems(testId);

			problems = problemList.map((pb) => ({
				problem_number: pb.problem_number,
				...pb.full_problems,
			}));
			loadingProblems = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function openTest() {
		try {
			const generateQR = async (text: string) => {
				return await QRCode.toString(text, { type: "svg" });
			};

			// When mitex supports brackets, we can remove this.
			for (let problem of problems) {
				problem.problem_latex = problem.problem_latex.replaceAll("\\(", "$");
				problem.problem_latex = problem.problem_latex.replaceAll("\\)", "$");
				problem.problem_latex = problem.problem_latex.replaceAll("\\[", "$$");
				problem.problem_latex = problem.problem_latex.replaceAll("\\]", "$$");
			}
			const qr_text = await generateQR(test.id.toString());
			let utf8Encode = new TextEncoder();
			Typst.mapShadow("/assets/qr.svg", utf8Encode.encode(qr_text));
			const test_metadata = JSON.stringify({ name: test.test_name });
			Typst.mapShadow(
				"/assets/test_metadata.json",
				utf8Encode.encode(test_metadata)
			);
			Typst.mapShadow(
				"/assets/problems.json",
				utf8Encode.encode(JSON.stringify(problems))
			);
			Typst.mapShadow(
				"/answer_sheet_compiling.toml",
				utf8Encode.encode("[config]\nlocal = false")
			);

			const answer_template_body = await fetch(answerSheet).then((r) =>
				r.text()
			);

			let { images, errorList }: { images: ProblemImage[]; errorList: any[] } =
				(
					await Promise.all(
						problems.map((p) =>
							ImageBucket.downloadLatexImages(p.problem_latex)
						)
					)
				).reduce((a, e) => {
					a.errorList = a.errorList.concat(e.errorList);
					a.images = a.images.concat(e.images);
					return a;
				});
			if (errorList.length > 0) {
				throw errorList;
			}

			for (const image of images) {
				Typst.mapShadow(
					"/problem_images" + image.name,
					new Uint8Array(await image.blob.arrayBuffer())
				);
			}

			Typst.pdf({ mainContent: answer_template_body }).then((array) => {
				const downloadURL = (data, fileName) => {
					const a = document.createElement("a");
					a.href = data;
					a.download = fileName;
					document.body.appendChild(a);
					a.style.display = "none";
					a.click();
					a.remove();
				};

				const downloadBlob = (data, fileName, mimeType) => {
					const url = window.URL.createObjectURL(
						new Blob([data], {
							type: mimeType,
						})
					);
					downloadURL(url, fileName);
					setTimeout(() => window.URL.revokeObjectURL(url), 1000);
				};

				downloadBlob(array, test.test_name + ".pdf", "application/pdf");
			});
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getTest();
</script>

<br />
{#if loading}
	<Loading />
{:else}
	<div>
		<h1>Test: {test.test_name}</h1>
		<p><strong>Tournament:</strong> {test.tournaments.tournament_name}</p>
		<p><strong>Description:</strong> {test.test_description}</p>
		<p style="margin-bottom: 5px;">
			<strong>Coordinators:</strong>
		</p>
		<div class="flex">
			<ul style="text-align: left;">
				{#each testCoordinators as coordinator}
					<li>- {coordinator.full_name}</li>
				{/each}
			</ul>
		</div>
		<br />
		{#if userIsTestCoordinator}
			<Button href={`/tests/${testId}/edit`} title="Edit problems" />
			<br /><br />
			<Button href={`/tests/${testId}/testsolve`} title="Manage testsolves" />
			<br /><br />
			<Button
				action={() => {
					openModal = !openModal;
				}}
				title="Open Test"
			/>
			<br /><br />
			<Button href={`/tests/${testId}/feedback`} title="Manage Feedback" />
		{/if}
		{#if loadingProblems}
			<p>Loading problems...</p>
		{:else}
			<div style="width: 80%; margin: auto; padding: 20px;">
				<ProblemList
					{problems}
					showList={[
						"full_name",
						"topics_short",
						"sub_topics",
						"problem_tests",
						"average_difficulty",
						"average_quality",
						"unresolved_count",
					]}
					customHeaders={[
						{ key: "problem_number", value: "", icon: "ri-hashtag" },
					]}
				/>
			</div>
		{/if}
	</div>

	{#if openModal}
		<div
			class="flex"
			style="background-color: rgba(0,0,0,0.5); position: absolute; top: 0; bottom: 0;right:0;left: 0;z-index: 100;"
		>
			<div
				style="width: 300px; height: max-content; z-index: 101;background-color: white;padding: 10px;position: relative;"
			>
				<div style="position: absolute; top: 5px; right: 8px;">
					<button
						on:click={() => {
							openModal = !openModal;
						}}
						style="font-size: 12px;cursor:pointer;outline: none;border: none;background: none;"
						><i class="fa-solid fa-x" /></button
					>
				</div>

				<p><strong>PDF Options</strong></p>

				{#each values as value}
					<Checkbox bind:group labelText={value} {value} />
				{/each}

				<br />
				<button on:click={openTest}>Download Test</button>
				<br /><br />
			</div>
		</div>
	{/if}
{/if}
<br />
