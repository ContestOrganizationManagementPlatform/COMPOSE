<script>
	import { page } from "$app/stores";
	import { get } from "svelte/store";
	import Grading from "$lib/components/Grading.svelte";

	const queryParams = new URLSearchParams(get(page).query);
	const tournamentId = parseInt($page.params.tournament);
	const testId = parseInt($page.params.test);
	const showGrades = queryParams.get("showGrades") === "true";
	const onlyConflicted = queryParams.get("onlyConflicted") === "true";
	const confirmationRequired = queryParams.get("confirmationRequired") === "true";
</script>

<Grading
	tournamentId={tournamentId}
	testId={testId}
	showGrades={showGrades}
	onlyConflicted={onlyConflicted}
	confirmationRequired={confirmationRequired}
/>
