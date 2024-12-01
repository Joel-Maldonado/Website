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

<nav class="absolute left-0 right-0 top-0 z-20 px-12 py-8">
	<ul class="flex justify-end gap-8 font-heebo font-light">
		<li>
			<a href="/" class="text-white/70 transition-colors hover:text-white">Home</a>
		</li>
		<li>
			<a href="/projects" class="text-white/70 transition-colors hover:text-white">Projects</a>
		</li>
		<li>
			<a href="/blog" class="text-white/70 transition-colors hover:text-white">Blog</a>
		</li>
		<li>
			<a href="/about" class="text-white/70 transition-colors hover:text-white">About</a>
		</li>
	</ul>
</nav>

<div>
	{@render children()}
</div>

<style>
	:global(body) {
		background: black;
	}
</style>
