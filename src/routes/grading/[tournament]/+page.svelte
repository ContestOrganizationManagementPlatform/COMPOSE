<script lang="ts">
	let loaded = false;
	import { page } from "$app/stores";
	import { getTournamentTests } from "$lib/supabase";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	const tournament_id = Number($page.params.tournament);
	console.log(tournament_id);
	let tests = [];

	(async () => {
		try {
			tests = await getTournamentTests(tournament_id, "*");
			tests = [
				{
					id: 1,
					test_name: "Team Round",
					num_scans: 68, //E.g. number of scans to be graded
					num_scan_problems: 680, //E.g. total number of individual answers to be graded
					graded_scan_problems: 455, //E.g. number of individual answers already graded
					conflict_scan_problems: 122, //E.g. number of individual answers with conflicting grades
				},
				{
					id: 2,
					test_name: "General Round",
					num_scans: 20, //E.g. number of scans to be graded
					num_scan_problems: 500, //E.g. total number of individual answers to be graded
					graded_scan_problems: 100, //E.g. number of individual answers already graded
					conflict_scan_problems: 20, //E.g. number of individual answers with conflicting grades
				},
				{
					id: 3,
					test_name: "Not Uploaded Round",
					num_scans: 0, //E.g. number of scans to be graded
					num_scan_problems: 0, //E.g. total number of individual answers to be graded
					graded_scan_problems: 0, //E.g. number of individual answers already graded
					conflict_scan_problems: 0, //E.g. number of individual answers with conflicting grades
				},
			];
			tests.sort((a, b) => {
				if (a.num_scans === 0 && b.num_scans === 0) {
					return 0;
				} else if (a.num_scans === 0) {
					return 1;
				} else if (b.num_scans === 0) {
					return -1;
				} else {
					// Calculate progress for both tests
					const progressA = calculateProgress(
						a.graded_scan_problems + a.conflict_scan_problems,
						a.num_scan_problems
					);
					const progressB = calculateProgress(
						b.graded_scan_problems + b.conflict_scan_problems,
						b.num_scan_problems
					);
					// Sort by progress (least to most)
					return progressA - progressB;
				}
			});
			loaded = true;
			console.log(tests);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	})();

	function calculateProgress(graded, total) {
		return (graded / total) * 100;
	}
</script>

<div class="page">
	<h1>Grading</h1>
	{#if !loaded}
		<p>Loading problems...</p>
	{/if}

	<br />

	<p style="font-style: italic;">Pick a tournament to grade</p>
	<div class="buttonContainer">
		{#each tests as test, index (test.id)}
			<div>
				<a
					class="problemContainer"
					href="/grading/{test.id}"
					style="background: linear-gradient(to right, var(--primary-light) {calculateProgress(
						test.graded_scan_problems,
						test.num_scan_problems
					)}%, var(--primary-tint) {calculateProgress(
						test.graded_scan_problems + test.conflict_scan_problems,
						test.num_scan_problems
					)}%, #ffffff {calculateProgress(
						test.graded_scan_problems + test.conflict_scan_problems,
						test.num_scan_problems
					)}%);"
				>
					<h4>{test.test_name}</h4>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.problemContainer {
		background-color: white;
		border: 3px solid var(--primary-tint);
		padding: 10px;
		margin: 10px;
		border-radius: 20px;
		text-align: center;
		font-weight: bold;
		text-decoration: none;
		display: block;
		color: var(--text-color-dark);
		transition: all 0.3s ease; /* Add transition for smooth hover effect */
	}

	.problemContainer:hover {
		transform: scale(1.05); /* Scale up on hover */
		border-width: 5px; /* Increase border width on hover */
	}

	.buttonContainer {
		flex-direction: column; /* Align children vertically */
		align-items: center; /* Center children horizontally */
		justify-content: center; /* Center children vertically */
		margin: 0 auto; /* Center the container horizontally on the page */
		width: 70%;
	}
</style>
