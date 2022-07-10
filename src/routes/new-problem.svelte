<script>
	import {
		Dropdown,
		TextInput,
		Form,
		FormGroup,
	} from "carbon-components-svelte";
</script>

<h1>Create New Problem</h1>
<Form>
	<FormGroup style="display: flex; margin: 25px; justify-content: start;">
		<Dropdown
			selectedId="0"
			style="width: 20em; margin-right: 10px;"
			items={[
				{ id: "0", text: "Topic" },
				{ id: "1", text: "Algebra" },
				{ id: "2", text: "Combo" },
				{ id: "3", text: "Number Theory" },
				{ id: "4", text: "Geometry" },
				{ id: "5", text: "Mixed" },
			]}
		/>
		<TextInput placeholder="Sub-Topic" style="width: 20em;" />
		<TextInput type="number" placeholder="Difficulty" style="width: 20em;" />
	</FormGroup>
</Form>
