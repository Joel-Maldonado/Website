<script>
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	let { children } = $props();

	let animate = $state(false);

	const currentYear = new Date().getFullYear();
	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Joel M.</title>
	<meta
		name="description"
		content="The software development portfolio and blog website for Joel Maldonado-Ruiz"
	/>
</svelte:head>

{#if animate}
	<nav class="absolute left-0 right-0 top-0 z-20 px-12 py-8" transition:fade={{ duration: 1500 }}>
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
{/if}

<div>
	{@render children()}
</div>

<footer class="mt-auto py-10 backdrop-blur-sm">
	<div class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
		<p class="text-white/70">
			© {currentYear} Joel Maldonado-Ruiz
		</p>

		<ul class="flex items-center gap-6">
			<li>
				<a
					href="https://github.com/Joel-Maldonado"
					target="_blank"
					rel="noopener"
					class="text-white/70 transition-colors hover:text-white"
				>
					<Icon icon="mdi:github" class="text-2xl" />
				</a>
			</li>
			<li>
				<a
					href="https://www.linkedin.com/in/joel-maldonado-ruiz/"
					target="_blank"
					rel="noopener"
					class="text-white/70 transition-colors hover:text-white"
				>
					<Icon icon="mdi:linkedin" class="text-2xl" />
				</a>
			</li>
			<li>
				<a
					href="mailto:maldonjo@oregonstate.edu"
					target="_blank"
					rel="noopener"
					class="text-white/70 transition-colors hover:text-white"
				>
					<Icon icon="mdi:email" class="text-2xl" />
				</a>
			</li>
			<li>
				<a href="/resume" rel="noopener" class="text-white/70 transition-colors hover:text-white">
					<Icon icon="mdi:file-document" class="text-2xl" />
				</a>
			</li>
		</ul>
	</div>
</footer>

<style>
	:global(body) {
		background-color: theme('colors.space-grey.700');
		min-height: 100vh;
	}
</style>
