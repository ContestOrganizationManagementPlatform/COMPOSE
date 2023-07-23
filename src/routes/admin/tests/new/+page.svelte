<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		TextInput,
		TextArea,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";

	let tournaments = [];
	let name = "";
	let description = "";
	let selectItem;

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			toast.error(error.message);
		}
		tournaments = tournamentList;
	}

	async function createTest(e) {
		e.preventDefault();
		const { data, error } = await supabase.from("tests").insert([
			{
				test_name: name,
				test_description: description,
				tournament_id: selectItem.value,
			},
		]);
		if (error) {
			toast.error(error.message);
		} else window.location.replace("/admin/tests/" + data[0].id);
	}

	getTournaments();
</script>

<br />
<h1>Admin: Add Test</h1>

<form on:submit|preventDefault style="padding: 20px;">
	<Select bind:ref={selectItem}>
		{#each tournaments as tournament}
			<SelectItem
				value={tournament.id}
				text="{tournament.id}: {tournament.tournament_name}"
			/>
		{/each}
	</Select>
	<br />
	<TextInput
		bind:value={name}
		class="textInput"
		label="Test Name"
		placeholder="Test Name"
	/>
	<br />
	<TextArea
		bind:value={description}
		label="Test Description"
		class="textArea"
		placeholder="Test Description"
	/>
	<br />
	<Button action={createTest} title="Add Test" />
</form>
