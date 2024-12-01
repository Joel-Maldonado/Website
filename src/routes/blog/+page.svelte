<script>
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';

	const blogPosts = [
		{
			title: 'Building a Neural Network Chess Engine',
			description:
				'Deep dive into the development process of Brainstorm, exploring the challenges and solutions in combining neural networks with traditional chess engines.',
			date: '2024-01-15',
			readTime: '10 min read',
			tags: ['Chess Engine', 'Neural Networks', 'Rust', 'AI'],
			image: 'https://example.com/chess-engine.jpg',
			slug: 'building-neural-network-chess-engine'
		},
		{
			title: 'Understanding Alpha-Beta Pruning',
			description:
				'A technical exploration of the alpha-beta pruning algorithm and its implementation in chess engines.',
			date: '2024-01-01',
			readTime: '8 min read',
			tags: ['Algorithms', 'Chess', 'Game Theory'],
			image: 'https://example.com/alpha-beta.jpg',
			slug: 'understanding-alpha-beta-pruning'
		}
	];

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
					Thoughts on software engineering, AI, and chess engines
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
