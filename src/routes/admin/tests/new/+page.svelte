<script lang="ts">
	import {
		Select,
		SelectItem,
		TextInput,
		TextArea,
	} from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError";
	import { createTest, getAllTournaments } from "$lib/supabase";

	let tournaments = [];
	let name = "";
	let description = "";
	let selectItem;

	async function getTournaments() {
		try {
			tournaments = await getAllTournaments();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function createTestSubmit(e) {
		try {
			e.preventDefault();
			const data = await createTest({
				test_name: name,
				test_description: description,
				tournament_id: selectItem.value,
			});
			window.location.replace("/admin/tests/" + data.id);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
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
	<Button action={createTestSubmit} title="Add Test" />
</form>
