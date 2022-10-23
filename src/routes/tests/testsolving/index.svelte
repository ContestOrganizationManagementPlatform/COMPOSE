<script context="module">
	export const prerender = true;
</script>

<script>
	import Button from "$lib/components/Button.svelte";
</script>

<br />
<h1>All Testsolves</h1>
<p>Here you can view and manage all testsolves:</p>
<br />
<Button href={`/tests/testsolving/past`} title="Past Testsolves" /><br /><br />
<Button href={`/tests/testsolving/upcoming`} title="Upcoming Testsolves" /><br
/><br />
<Button href={`/tests/testsolving/new`} title="Create New Testsolve" />
