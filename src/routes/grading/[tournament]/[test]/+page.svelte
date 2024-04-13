<script lang="ts">
	import { page } from "$app/stores";
	import Grading from "$lib/components/Grading.svelte";

	let is_override = $page.url.searchParams.has('override');
</script>

<Grading
	tournamentId={parseInt($page.params.tournament)}
	testId={parseInt($page.params.test)}
  showGrades={is_override}
  onlyConflicted={is_override}
  disableUnsure={is_override}
/>
