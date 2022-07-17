<script>
	import { supabase } from "$lib/supabaseClient";
    import { Menu } from "$lib/components";
	import {
		Select,
		SelectItem,
		TextInput,
		TextArea,
	} from "carbon-components-svelte";

	let tournaments = [];
	let tests = [];

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			alert(error);
		}
		tournaments = tournamentList;
	}

	getTournaments();
</script>

<form>
	<Select>
		{#each tournaments as tournament}
			<SelectItem>{tournament.id}: {tournament.tournament_name}</SelectItem>
		{/each}
	</Select>
	<TextInput label="Test Name" />
	<TextArea label="Test Description" />
</form>
