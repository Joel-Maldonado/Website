<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';

	let animate = $state(false);
	let showTableOfContents = $state(false);
	let showProjects = $state(false);
	let projects = $state([]);
	let blogPosts = $state([]);

	const INITIAL_DELAY = 800; // First icon appears after this delay
	const DELAY_BETWEEN = 180; // Delay between each icon animation

	onMount(async () => {
		animate = true;

		const scrollHandler = () => {
			if (window.scrollY > 100) {
				showProjects = true;
				showTableOfContents = true;
				window.removeEventListener('scroll', scrollHandler);
			}
		};
		window.addEventListener('scroll', scrollHandler);

		const projects_response = await fetch('/api/projects?limit=2');
		const data = await projects_response.json();
		projects = data.projects;

		const blogPosts_response = await fetch('/api/blogs?limit=2');
		const blogData = await blogPosts_response.json();
		blogPosts = blogData;

		console.log(blogPosts);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{
				rootMargin: '-50% 0px',
				threshold: 0
			}
		);

		sections.forEach((section) => {
			const element = document.getElementById(section.id);
			if (element) observer.observe(element);
		});

		// Make the selector more specific to only target table of contents links
		document.querySelectorAll('.table-of-contents[data-scroll-nav] a').forEach((anchor) => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = anchor.getAttribute('href')?.slice(1);
				document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
			});
		});
	});

	const sections = [
		{ id: 'home', title: 'Home' },
		{ id: 'recent-blogs', title: 'Blogs' },
		{ id: 'projects', title: 'Projects' }
	];

	let activeSection = $state(sections[0].id);
</script>

{#if showTableOfContents}
	<div class="fixed left-4 top-1/2 z-20 -translate-y-1/2" transition:fade={{ duration: 300 }}>
		<nav class="table-of-contents space-y-4" data-scroll-nav>
			{#each sections as section}
				<a
					href="#{section.id}"
					class="block text-white/60 transition-colors hover:text-white {activeSection ===
					section.id
						? 'active'
						: ''}"
				>
					{section.title}
				</a>
			{/each}
		</nav>
	</div>
{/if}

<Background />

<div class="bg-transparent backdrop-blur-sm">
	<header
		id="home"
		class="relative h-[110vh] overflow-hidden bg-gradient-to-b from-black/30 to-transparent p-12 text-center"
	>
		{#if animate}
			<div class="relative z-10 flex h-full flex-col items-center justify-center gap-6">
				<h1
					in:fly={{ y: -40, duration: 1800 }}
					class="title-glow font-heebo text-8xl text-white drop-shadow-[0_2.4px_2.4px_rgba(0,0,0,0.8)]
"
				>
					Joel Maldonado-Ruiz
				</h1>

				<ul class="flex items-center px-16">
					<li transition:fade={{ delay: INITIAL_DELAY }}>
						<a href="https://github.com/Joel-Maldonado" target="_blank" rel="noopener"
							><Icon icon="mdi:github" class="text-6xl text-white" /></a
						>
					</li>
					<li
						class="mx-4 h-12 w-px bg-white/20"
						transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN }}
					></li>
					<li transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN * 2 }}>
						<a
							href="https://www.linkedin.com/in/joel-maldonado-ruiz/"
							target="_blank"
							rel="noopener"><Icon icon="mdi:linkedin" class="text-6xl text-white" /></a
						>
					</li>
					<li
						class="mx-4 h-12 w-px bg-white/20"
						transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN * 3 }}
					></li>
					<li transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN * 4 }}>
						<a href="mailto:maldonjo@oregonstate.edu" target="_blank" rel="noopener"
							><Icon icon="mdi:email" class="text-6xl text-white" /></a
						>
					</li>
					<li
						class="mx-4 h-12 w-px bg-white/20"
						transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN * 5 }}
					></li>
					<li transition:fade={{ delay: INITIAL_DELAY + DELAY_BETWEEN * 6 }}>
						<a href="/resume" rel="noopener"
							><Icon icon="mdi:file-document" class="text-6xl text-white" /></a
						>
					</li>
				</ul>
			</div>
		{/if}
	</header>

	<!-- Blog Section -->
	<section id="recent-blogs" class="relative w-full px-4 pb-8">
		<div class="relative z-10">
			<h2 class="mb-16 text-center font-heebo text-5xl text-white">Recent Blogs</h2>

			<main class="mx-auto max-w-5xl px-4 pb-12">
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
					{#each blogPosts as post, index}
						<div in:staggeredFade|global={{ delay: index * 150 }}>
							<BlogCard {...post} />
						</div>
					{/each}
				</div>
			</main>

			<div class="mx-auto my-12 max-w-2xl">
				<div class="text-center">
					<a
						href="/blog"
						class="inline-flex items-center gap-2 rounded-lg bg-space-grey-500 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-space-grey-450"
					>
						<span>See All Blogs</span>
						<Icon icon="mdi:arrow-right" class="text-2xl" />
					</a>
				</div>
			</div>
		</div>
	</section>
	<!-- Blog Section -->

	<div class="mx-auto my-16 max-w-5xl">
		<hr class="border-t-2 border-white/10" />
	</div>

	<!-- Project Section -->
	<section id="projects" class="relative w-full px-4 py-16">
		<div class="relative z-10">
			<h2 class="mb-16 text-center font-heebo text-5xl text-white">Featured Projects</h2>

			<div class="mx-auto max-w-2xl space-y-8">
				{#each projects as project}
					{#if showProjects}
						<div transition:fly={{ duration: 1500, x: -100 }}>
							<ProjectCard {...project} size="small" />
						</div>
					{/if}
				{/each}
			</div>

			<div class="mx-auto my-12 max-w-2xl">
				<div class="text-center">
					<a
						href="/projects"
						class="inline-flex items-center gap-2 rounded-lg bg-space-grey-500 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-space-grey-450"
					>
						<span>See All Projects</span>
						<Icon icon="mdi:arrow-right" class="text-2xl" />
					</a>
				</div>
			</div>
		</div>
	</section>
	<!-- Project Section -->
</div>

<style>
	@keyframes glow {
		0% {
			text-shadow:
				0 0 25px rgba(255, 255, 255, 0.04),
				0 0 50px rgba(255, 255, 255, 0.02);
		}
		35% {
			text-shadow:
				0 0 25px rgba(255, 255, 255, 0.25),
				0 0 50px rgba(255, 255, 255, 0.18),
				0 0 75px rgba(255, 255, 255, 0.1);
		}
		100% {
			text-shadow:
				0 0 25px rgba(255, 255, 255, 0.04),
				0 0 50px rgba(255, 255, 255, 0.02);
		}
	}

	.title-glow {
		animation: glow 5s cubic-bezier(0.4, 0, 0.2, 1) 1;
		letter-spacing: -0.02em;
	}

	nav a {
		font-size: 0.95rem;
		font-weight: 500;
		padding: 0.4rem 0.8rem;
		border-left: 2px solid rgba(255, 255, 255, 0.1);
		text-decoration: none;
	}

	nav a:hover {
		border-left: 2px solid rgba(255, 255, 255, 0.5);
	}

	nav a.active {
		border-left: 2px solid rgba(255, 255, 255, 1);
		color: white;
	}
</style>
