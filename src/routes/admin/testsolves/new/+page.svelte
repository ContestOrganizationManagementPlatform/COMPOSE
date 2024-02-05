<script>
	import { Select, SelectItem } from "carbon-components-svelte";
	import Button from "$lib/components/Button.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import toast from "svelte-french-toast";
	import { handleError } from "$lib/handleError.ts";
	import {
		getAllTests,
		getAllUsers,
		addTestsolver,
		getTestInfo,
	} from "$lib/supabase";
	import scheme from "$lib/scheme.json";

	let finalUser = "";
	let finalTest = "";
	let users = [];
	let tests = [];
	let loading = true;

	async function getUsers() {
		try {
			users = await getAllUsers();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getTests() {
		try {
			tests = await getAllTests();
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getUsers();
	getTests();
</script>

<br />
<h1>Create New Testsolve</h1>

<div style="padding: 20px;">
	{#if loading}
		<Loading />
	{:else}
		<Select labelText="Testsolver" bind:selected={finalUser}>
			<SelectItem text="" value="" />
			{#each users as user}
				<SelectItem text={user.full_name} value={user.id} />
			{/each}
		</Select>
		<br />
		<Select labelText="Test" bind:selected={finalTest}>
			<SelectItem text="" value="" />
			{#each tests as test}
				<SelectItem text={test.test_name} value={test.id} />
			{/each}
		</Select>
		<br />
		<Button
			title="Submit"
			action={async () => {
				try {
					if (finalTest === "" || finalUser === "") {
						toast.error("Please select a test and a user");
					} else {
						await addTestsolver({ test_id: finalTest, solver_id: finalUser });
						const testInfo = await getTestInfo(finalTest);

						const embed = {
							title:
								"You have been assigned a test for the following test: " +
								testInfo.test_name,
							//description: "This is the description of the embed.",
							type: "rich",
							color: parseInt(scheme.embed_color, 16), // You can set the color using hex values
							author: {
								name: finalUser,
								//icon_url: "https://example.com/author.png", // URL to the author's icon
							},
							footer: {
								text: "COMPOSE",
								icon_url: scheme.logo, // URL to the footer icon
							},
						};

						const linkButton = {
							type: 2, // LINK button component
							style: 5, // LINK style (5) for external links
							label: "View Testsolve",
							url: scheme.url + "/tests/" + finalTest + "/testsolve/solve", // The external URL you want to link to
						};

						await fetch("/api/discord/dm", {
							method: "POST",
							body: JSON.stringify({
								userId: finalUser,
								message: "",
								embeds: [embed],
								components: [
									{
										type: 1,
										components: [linkButton],
									},
								],
							}),
						});

						toast.success("Success! Added testsolve.");
					}
				} catch (error) {
					handleError(error);
					toast.error(error.message);
				}
			}}
		/>
	{/if}
</div>
