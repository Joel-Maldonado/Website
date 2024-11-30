<script>
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';

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
						<article
							class="group overflow-hidden rounded-lg bg-neutral-800/100 backdrop-blur-sm transition-all hover:bg-neutral-700/50"
							in:staggeredFade|global={{ delay: index * 150 }}
						>
							{#if post.image}
								<div class="aspect-[16/9] w-full overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							{/if}
							<div class="p-4">
								<div class="mb-2 flex items-center gap-2 text-xs text-white/60">
									<span>{post.date}</span>
									<span>•</span>
									<span>{post.readTime}</span>
								</div>
								<h2 class="mb-2 font-heebo text-xl text-white">
									<a href={`/blog/${post.slug}`} class="hover:text-blue-400">
										{post.title}
									</a>
								</h2>
								<p class="mb-4 line-clamp-3 text-sm leading-relaxed text-white/80">
									{post.description}
								</p>

								<div class="flex flex-wrap gap-1">
									{#each post.tags as tag}
										<span
											class="rounded-full bg-neutral-700/50 px-2 py-1 text-xs font-medium text-white/80"
										>
											{tag}
										</span>
									{/each}
								</div>
							</div>
						</article>
					{/each}
				</div>
			</main>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background: linear-gradient(
			180deg,
			rgba(47, 47, 47, 0.3) 0%,
			rgba(47, 47, 47, 0.4) 50%,
			rgba(47, 47, 47, 0.5) 100%
		);
	}
</style>
