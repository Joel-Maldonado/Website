<script>
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';

	let { data } = $props();
	let blogPosts = data.blogPosts;

	let animate = $state(false);
	onMount(() => {
		animate = true;
		document.title = 'Joel M. | Blog';
	});

	// Add this function for staggered fade
	function staggeredFade(node, { delay = 0 }) {
		return {
			delay,
			duration: 400,
			css: (t) => `
				opacity: ${t};
				transform: translateY(${(1 - t) * 20}px)
			`
		};
	}
</script>

<div class="relative min-h-screen">
	<Background />

	{#if animate}
		<div class="relative z-10">
			<header class="py-20 text-center" transition:fade={{ duration: 1000 }}>
				<h1 class="font-heebo text-5xl text-white">Blog</h1>
				<p class="mt-4 text-lg text-white/80">
					Adventures in software, technical deep dives, and interesting tangents
				</p>
			</header>

			<main class="mx-auto max-w-7xl px-4 pb-20">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each blogPosts as post, index}
						<div in:staggeredFade|global={{ delay: index * 150 }}>
							<BlogCard {...post} />
						</div>
					{/each}
				</div>
			</main>
		</div>
	{/if}
</div>
