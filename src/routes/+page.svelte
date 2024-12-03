<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let animate = $state(false);
	let showTableOfContents = $state(false);
	let showProjects = $state(false);
	let projects = $state([]);

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

		const response = await fetch('/api/projects?limit=2');
		const data = await response.json();
		projects = data.projects;

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
		{ id: 'projects', title: 'Projects' }
	];

	let activeSection = $state(sections[0].id);
</script>

{#if showTableOfContents}
	<div class="fixed left-8 top-1/2 z-20 -translate-y-1/2" transition:fade={{ duration: 300 }}>
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

	<section id="projects" class="relative w-full px-4 py-16">
		<div class="relative z-10">
			<h2 class="mb-16 text-center font-heebo text-4xl text-white">Featured Projects</h2>

			<div class="mx-auto max-w-3xl space-y-10">
				{#each projects as project}
					{#if showProjects}
						<div transition:fly={{ duration: 1500, x: -100 }}>
							<ProjectCard {...project} />
						</div>
					{/if}
				{/each}

				<div class="mt-12 text-center">
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
		font-size: 1.1rem;
		font-weight: 500;
		padding: 0.5rem 1rem;
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
