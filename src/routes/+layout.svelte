<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Joel M.</title>
	<meta
		name="description"
		content="The software development portfolio and blog website for Joel Maldonado-Ruiz"
	/>
</svelte:head>

<div>
	{@render children()}
</div>
