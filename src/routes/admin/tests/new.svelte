<script>
	import { supabase } from "$lib/supabaseClient";
	import {
		Select,
		SelectItem,
		TextInput,
		TextArea,
		InlineNotification,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";

	let tournaments = [];
	let name = "";
	let description = "";
	let selectItem;

	let errorTrue = false;
	let errorMessage = "";

	async function getTournaments() {
		let { data: tournamentList, error } = await supabase
			.from("tournaments")
			.select("*");
		if (error) {
			errorTrue = true;
			errorMessage = error.message;
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
			errorTrue = true;
			errorMessage = error.message;
		} else window.location.replace("/admin/tests/" + data[0].id);
	}

	getTournaments();
</script>

<br />
<h1>Admin: Add Test</h1>

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
