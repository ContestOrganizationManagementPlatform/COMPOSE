<script>
	import { supabase } from "$lib/supabaseClient";
	import ProblemEditor from "$lib/components/ProblemEditor.svelte";
	import { InlineNotification } from "carbon-components-svelte";
	import { ImageBucket } from "$lib/ImageBucket";
	import Button from "$lib/components/Button.svelte";
	import { invalidate } from "$app/navigation";

	let errorTrue = false;
	let errorMessage = "";
	let authorName = "";
	let openModal = false;
	let problem_id = 0;

	async function getAuthorName() {
		let { data: user, error } = await supabase
			.from("users")
			.select("full_name")
			.eq("id", supabase.auth.user().id)
			.single();
		if (error) throw error;
		else authorName = user.full_name;
	}

	async function getFrontID(id) {
		let { data, error } = await supabase
			.from("front_ids")
			.select("front_id")
			.eq("problem_id", id)
			.single();
		
		console.log(data.front_id);
		if (error) throw error;
		else return data.front_id;
	}

	async function submitProblem(payload) {
		if (authorName === "") {
			alert("Please wait for author name to finish loading");
		} else {
			const { topics, problem_files, ...payloadNoTopics } = payload;
			let { data, error } = await supabase
				.from("problems")
				.insert([payloadNoTopics]);
			if (error) {
				errorTrue = true;
				errorMessage = error.message;
			}

			let problemId = data[0].id;

			let { error2 } = await supabase.from("problem_topics").insert(
				payload.topics.map((tp) => ({
					problem_id: problemId,
					topic_id: tp,
				}))
			);

			for (const file of problem_files) {
				let { error3 } = await supabase.storage
					.from("problem-images")
					.upload(`pb${problemId}/problem/${file.name}`, file, {
						upsert: true,
					});
			}

			let imageDownloadResult = await ImageBucket.downloadLatexImages(payload.problem_latex);
			let imageName = "";
			if (imageDownloadResult.images.length > 0) {
				imageName = await ImageBucket.getImageURL(imageDownloadResult.images[0].name);
			} else {
				imageDownloadResult = await ImageBucket.downloadLatexImages(payload.solution_latex);
				if (imageDownloadResult.images.length > 0) {
					imageName = await ImageBucket.getImageURL(imageDownloadResult.images[0].name);
				}
			}

			await fetch("/api/discord", {
				method: "POST",
				body: JSON.stringify({
					problem: payload,
					authorName: authorName,
					id: problemId,
					created_at: data[0].created_at,
					front_id: await getFrontID(problemId),
					image: imageName
				})
			});

			openModal = true;
			problem_id = problemId;
			//window.location.replace(`/problems/${problemId}`);
		}
	}

	getAuthorName();
</script>

<br />

{#if errorTrue}
	<div style="position: fixed; bottom: 10px; left: 10px;">
		<InlineNotification
			lowContrast
			kind="error"
			title="ERROR:"
			subtitle={errorMessage}
		/>
	</div>
{/if}

<h1>Create New Problem</h1>

<ProblemEditor onSubmit={submitProblem} />

{#if openModal}
	<div
		class="flex"
		style="background-color: rgba(0,0,0,0.5); position: absolute; top: 0; bottom: 0;right:0;left: 0;z-index: 100;"
	>
		<div
			style="width: 31rem; height: max-content; z-index: 101;background-color: white;padding: 10px;position: relative;"
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

			<p><strong>Problem Submitted!</strong></p>

			<br />
			<Button href="/problems/{problem_id}" title="Visit Problem" />
			<br /><br />
			<Button action={async () => {await invalidate("/problems/new"); window.location.replace('/problems/new');}} title="Create New Problem" />
			<br /><br />
			<Button href="/problems" title="View All Problems" />
			<br /><br />
		</div>
	</div>
{/if}