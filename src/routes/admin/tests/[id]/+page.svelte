<script lang="ts">
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import {
		TextInput,
		Select,
		SelectItem,
		TextArea,
	} from "carbon-components-svelte";
	import toast from "svelte-french-toast";
	import Modal from "$lib/components/Modal.svelte";
	import Button from "$lib/components/Button.svelte";

	import { handleError } from "$lib/handleError";
	import {
		addTestFeedbackQuestion,
		getTestInfo,
		addTestCoordinator,
		getTestCoordinators,
		removeTestCoordinator,
		editTestInfo,
	} from "$lib/supabase/tests";
	import { getUser } from "$lib/supabase/users";

	let testId = $page.params.id;
	let test;
	let testCoordinators = [];
	let loading = true;
	let allUsers = [];
	let selectRef;

	let curQuestion = "";
	let feedbackQuestions = [];

	async function getFeedbackQuestions() {
		try {
			let { data: test_feedback_questions, error } = await supabase
				.from("test_feedback_questions")
				.select("*")
				.eq("test_id", testId);
			if (error) throw error;

			feedbackQuestions = test_feedback_questions;
		} catch (error) {
			if (error.code !== "PGRST116") {
				handleError(error);
				toast.error(error.messsage);
			}
		}
	}

	async function addFeedbackQuestion() {
		try {
			await addTestFeedbackQuestion({
				test_id: Number(testId),
				question: curQuestion,
			});
			await getFeedbackQuestions();
			curQuestion = "";
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getOneUser(id: string) {
		try {
			const user = await getUser(id);
			return user;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getTest() {
		try {
			test = await getTestInfo(Number(testId));

			let queriedCoordinators = await getTestCoordinators(Number(testId));
			testCoordinators = queriedCoordinators.map((tc) => tc.users);

			loading = false;
			await getAllUsers();
			await getFeedbackQuestions();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function getAllUsers() {
		try {
			let { data: users, error } = await supabase
				.from("users")
				.select("*,test_coordinators(*)")
				.order("full_name");
			if (error) throw error;
			allUsers = users.filter(
				(x) => !testCoordinators.some((tc) => tc.id === x.id)
			);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function addTestCoordinatorSubmit(e) {
		try {
			await addTestCoordinator(Number(testId), selectRef.value);
			getTest();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function deleteTestCoordinator(testCoordinatorId: number) {
		try {
			await removeTestCoordinator(Number(testId), testCoordinatorId);
			getTest();
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function editTest() {
		try {
			await editTestInfo(
				{
					test_name: test.test_name,
					test_description: test.test_description,
				},
				Number(testId)
			);
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function deleteTest() {
		try {
			const { data, error } = await supabase
				.from("tests")
				.delete()
				.eq("id", testId);
			if (error) throw error;
			else window.location.replace("/admin/tests");
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	getTest();
</script>

<div style="padding: 10px">
	{#if loading}
		<p>Loading...</p>
	{:else}
		<h1>Test {testId}: {test.test_name}</h1>
		<br />
		<form on:submit|preventDefault>
			<Modal runHeader="Delete Test" onSubmit={deleteTest} />
		</form>
		<br />
		<br />
		<form on:submit|preventDefault>
			<TextInput label="Name" bind:value={test.test_name} />
			<br />
			<TextArea label="Description" bind:value={test.test_description} />
			<br />
			<Button action={editTest} title="Edit Test" />
		</form>
		<br />
		<br />
		<hr style="width: 60%;" />
		<br />
		<br />
		<h3><strong>Current Test Coordinators</strong></h3>
		{#if testCoordinators.length === 0}
			<p>There are no test coordinators</p>
		{:else}
			<div class="flex" style="width: 99%">
				<div
					class="grid"
					style="padding: 5px;column-gap: 10px;row-gap: 10px;width: 95%;"
				>
					{#each testCoordinators as testCoordinator}
						<div class="flex">
							<p
								style="margin-right: 10px; margin-top: auto; margin-bottom: auto;text-align: left;"
							>
								{testCoordinator.full_name}
							</p>
							<Modal
								runHeader="Remove {testCoordinator.full_name}"
								del={true}
								onSubmit={() => deleteTestCoordinator(testCoordinator.id)}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		<br /><br />
		<h3><strong>Add Test Coordinators</strong></h3>
		<form on:submit|preventDefault>
			<div class="flex">
				<div style="width: 60%">
					<Select bind:ref={selectRef}>
						{#each allUsers as user}
							<SelectItem
								value={user.id}
								text="{user.full_name} ({user.initials})"
							/>
						{/each}
					</Select>
				</div>
			</div>
			<br />
			<Button action={addTestCoordinatorSubmit} title="Add Test Coordinator" />
		</form>
		<br />
		<br />
		<hr style="width: 60%;" />
		<br />
		<br />
		<h3><strong>Current Feedback Questions</strong></h3>
		<br />
		<div class="flex">
			<div style="width: 60%">
				{#if feedbackQuestions.length > 0}
					<ol style="text-align: left;">
						{#each feedbackQuestions as question}
							<li style="margin-bottom: 8px;">- {question.question}</li>
						{/each}
					</ol>
				{:else}
					<p>There are no current questions.</p>
				{/if}
			</div>
		</div>

		<br />
		<h3><strong>Add Feedback Questions</strong></h3>
		<div class="flex">
			<div style="width: 60%">
				<TextInput labelText="Feedback Question" bind:value={curQuestion} />
			</div>
		</div>
		<br />
		<Button action={addFeedbackQuestion} title="Submit" />
		<br />
		<br />
	{/if}
</div>
