<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		TextInput,
		TextArea,
		Button,
	} from "carbon-components-svelte";
	import Menu from "$lib/components/Menu.svelte";

	let tournaments = [];
	let name = "";
	let description = "";
	let selectItem;

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			alert(error);
		}
		tournaments = tournamentList;
	}

	async function createTest() {
		const { data, error } = await supabase.from("tests").insert([
			{
				test_name: name,
				test_description: description,
				tournament_id: selectItem.value,
			},
		]);
	}

	getTournaments();
</script>

<Menu path="admin/new-test" />
<h1>Add Test</h1>

<form>
	<Select bind:ref={selectItem}>
		{#each tournaments as tournament}
			<SelectItem
				value={tournament.id}
				text="{tournament.id}: {tournament.tournament_name}"
			/>
		{/each}
	</Select>
	<TextInput bind:value={name} label="Test Name" placeholder="Test Name" />
	<TextArea
		bind:value={description}
		label="Test Description"
		placeholder="Test Description"
	/>
	<Button on:click={createTest}>Add Test</Button>
</form>
