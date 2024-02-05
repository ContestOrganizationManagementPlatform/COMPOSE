<script>
	import { formatDate } from "$lib/formatDate";
	import {
		DataTable,
		Link,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import Modal from "$lib/components/Modal.svelte";
	import toast from "svelte-french-toast";
	import Button from "$lib/components/Button.svelte";
	import TestsolveList from "$lib/components/TestsolveList.svelte";
	import { handleError } from "$lib/handleError.ts";
	import { deleteTestsolve, getAllTestsolves } from "$lib/supabase";

	let loading = true;
	let testsolves = [];
	let pageSize = 25;
	let page = 1;

	async function getTestsolves() {
		try {
			loading = true;

			const testsolveInfo = await getAllTestsolves(
				"*,users(full_name,initials),tests(test_name)"
			);
			testsolves = testsolveInfo.map((e) => ({
				id: e.id,
				solver_id: e.solver_id,
				test_id: e.test_id,
				solver_name: e.users.full_name,
				solver_initials: e.users.initials,
				test_name: e.tests.test_name,
				start_time: e.start_time ? formatDate(new Date(e.start_time)) : null,
				elapsed: e.time_elapsed,
				test_version: e.test_version,
				status: e.status,
			}));
			loading = false;
		} catch (error) {
			handleError(error);
			toast.error(error.message);
		}
	}

	async function onDelete(id) {
		await deleteTestsolve(id);
		await getTestsolves();
	}

	getTestsolves();

	$: testsolvesSameWeek = testsolves
		.filter((row) => {
			var today = new Date();
			var nextWeek = Date.parse(
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
			);

			if (nextWeek > new Date(row.end_time)) {
				return false;
			} else {
				return true;
			}
		})
		.map((row) => row.id);

	$: selectors = testsolvesSameWeek.map((id) => `[data-row="${id}"]`).join(",");

	$: styles = `
		<style>
		${selectors} {
			outline: 1.5px solid var(--primary);
		}
		<\/style>
	`;
</script>

<svelte:head>
	{@html styles}
</svelte:head>

<br />
<h1 style="margin-bottom: 5px;">Admin Testsolves</h1>
<Button href="/admin/testsolves/new" title="Create new testsolve" />

<div style="padding: 20px">
	<TestsolveList {onDelete} {testsolves} />
</div>
