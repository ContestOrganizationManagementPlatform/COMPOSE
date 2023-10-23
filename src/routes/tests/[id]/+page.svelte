<script lang="ts">
	import { page } from "$app/stores";
	import ProblemList from "$lib/components/ProblemList.svelte";
	import Button from "$lib/components/Button.svelte";
	import { Loading, Checkbox } from "carbon-components-svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import {
		getImages,
		getProblemTestsolveAnswersOrder,
		getTestInfo,
		getTestProblems,
		getThisUser,
		getThisUserRole,
	} from "$lib/supabase";

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
				"*,test_coordinators(users(*)),tournaments(tournament_name),testsolves(test_id,feedback,id)"
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

			let { data: feedbackList, error2 } = await supabase
				.from("testsolve_answers")
				.select("*")
				.order("problem_id");
			if (error2) throw error2;

			feedback = feedbackList;

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

	function getProblemFeedback(id) {
		var returning = [];
		for (var prob of feedback) {
			if (prob.problem_id == id) {
				returning.push(prob);
			}
		}
		return returning;
	}

	async function getBucketPaths(path) {
		try {
			const data = await getImages(path);
			let ans = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].id != null) {
					if (path === "") {
						ans.push(data[i].name);
					} else {
						ans.push(path + "/" + data[i].name);
					}
				} else {
					let x;
					if (path === "") {
						x = await getBucketPaths(data[i].name);
					} else {
						x = await getBucketPaths(path + "/" + data[i].name);
					}
					for (let j = 0; j < x.length; j++) {
						ans.push(x[j]);
					}
				}
			}
			return ans;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function openTest() {
		try {
			let l =
				"\\title{" +
				test.test_name +
				"}\\author{" +
				test.tournaments.tournament_name +
				"}\\date{Mustang Math}\\begin{document}\\maketitle";

			if (group.includes("Feedback")) {
				l += "\\section*{Test Feedback}";
				for (var feedback of test.testsolves) {
					if (feedback.feedback != null && feedback.feedback != "") {
						l +=
							"\\textbf{" +
							feedback.id +
							":} " +
							feedback.feedback +
							"\\newline";
					}
				}
			}

			for (const problem of problems) {
				l += group.includes("Problem ID")
					? "\\section*{Problem " +
					  (problem.problem_number + 1) +
					  " (" +
					  problem.front_id +
					  ")}"
					: "\\section*{Problem " + (problem.problem_number + 1) + "}";
				if (group.includes("Problems")) {
					l +=
						"\\textbf{Problem:} " +
						problem.problem_latex +
						"\\newline\\newline";
				}

				if (group.includes("Answers") && problem.answer_latex != "") {
					l +=
						"\\textbf{Answer:} " + problem.answer_latex + "\\newline\\newline";
				}

				if (group.includes("Solutions") && problem.solution_latex != "") {
					l +=
						"\\textbf{Solution:} " +
						problem.solution_latex.replace("\\ans{", "\\boxed{") +
						"\\newline\\newline";
				}

				if (group.includes("Comments") && problem.comment_latex != "") {
					l +=
						"\\textbf{Comment:} " +
						problem.comment_latex.replace("\\ans{", "\\boxed{") +
						"\\newline\\newline";
				}

				if (group.includes("Feedback")) {
					var feed = getProblemFeedback(problem.problem_number);

					if (feed.length > 0) {
						l += "\\textbf{Feedback:} ";

						for (var f of feed) {
							if (f.feedback != "") {
								l += "\\\\\\textbf{" + f.testsolve_id + ":} " + f.feedback;
							}
						}

						l += "\\newline\\newline";
					}
				}
			}
			l += "\\end{document}";

			let images = await getBucketPaths("");

			const resp = await fetch(
				// make env variable before pushing
				import.meta.env.VITE_PDF_GENERATOR_URL,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						mode: "no-cors",
					},
					body: JSON.stringify({
						latex: l,
						images,
					}),
				}
			);
			const blob = await resp.blob();
			const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.setAttribute("download", test.test_name + ".pdf");
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);

			// clean up Url
			window.URL.revokeObjectURL(blobUrl);
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
			<div style="padding: 20px;">
				<ProblemList
					{problems}
					customHeaders={[{ key: "problem_number", value: "#", width: "30px" }]}
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
