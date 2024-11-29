<script>
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Joel M.</title>
	<meta
		name="description"
		content="The software development portfolio and blog website for Joel Maldonado-Ruiz"
	/>
</svelte:head>

<header
	class="relative h-screen overflow-hidden bg-transparent p-12 text-center transition-colors dark:bg-black"
>
	<div class="relative z-10 flex h-full flex-col items-center justify-center gap-6">
		<h1 class="font-poppins text-6xl font-bold text-black dark:text-white" transition:fade>
			Joel Maldonado-Ruiz
		</h1>

		<p class="text-lg text-gray-800 dark:text-gray-200">
			Visit <a
				href="https://svelte.dev/docs/kit"
				class="text-blue-600 hover:underline dark:text-blue-400">svelte.dev/docs/kit</a
			> to read the documentation
		</p>
	</div>
</header>

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>
