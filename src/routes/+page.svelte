<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';

	let animate = $state(false);
	onMount(() => {
		animate = true;
	});

	const projects = [
		{
			title: 'Brainstorm: A Deep Learning Chess Engine',
			description:
				'An experimental chess engine that combines deep learning with traditional chess search techniques. Built in Rust, it uses a neural network trained on 37 million chess positions as its evaluation function, trading computational speed for pattern recognition. The project explores whether lower search depth can be compensated for by encoding positional understanding directly into the evaluation function.',
			technologies: ['Rust', 'PyTorch (libtorch)', 'Python', 'Neural Networks', 'UCI Protocol'],
			github: 'https://github.com/Joel-Maldonado/Brainstorm',
			live: null,
			image: 'https://github.com/user-attachments/assets/b22f3bfb-d127-4862-a539-0a2b10d19ec0'
		},
		{
			title: 'Project Name',
			description:
				'A detailed description of the project highlighting its key features, technologies used, and the problems it solves. This can be a few sentences long to give visitors a good understanding of the project.',
			technologies: ['React', 'Node.js', 'MongoDB'],
			github: 'https://github.com/username/project',
			live: 'https://project-demo.com',
			image: '/path/to/project-image.jpg' // Add project screenshots
		},
		{
			title: 'Project Name',
			description:
				'A detailed description of the project highlighting its key features, technologies used, and the problems it solves. This can be a few sentences long to give visitors a good understanding of the project.',
			technologies: ['React', 'Node.js', 'MongoDB'],
			github: 'https://github.com/username/project',
			live: 'https://project-demo.com',
			image: '/path/to/project-image.jpg' // Add project screenshots
		}
	];

	const sections = [
		{ id: 'home', title: 'Home' },
		{ id: 'projects', title: 'Projects' }
	];

	let activeSection = $state(sections[0].id);

	onMount(() => {
		animate = true;

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

		// Add smooth scrolling
		document.querySelectorAll('nav a').forEach((anchor) => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = anchor.getAttribute('href')?.slice(1);
				document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
			});
		});
	});
</script>

<div class="fixed left-8 top-1/2 z-20 -translate-y-1/2">
	<nav class="space-y-4">
		{#each sections as section}
			<a
				href="#{section.id}"
				class="block text-white/60 transition-colors hover:text-white {activeSection === section.id
					? 'active'
					: ''}"
			>
				{section.title}
			</a>
		{/each}
	</nav>
</div>

<header id="home" class="relative h-screen overflow-hidden bg-black/40 p-12 text-center">
	<Background />

	{#if animate}
		<div class="relative z-10 flex h-full flex-col items-center justify-center gap-6">
			<h1 in:fly={{ y: -40, duration: 2300 }} class="font-heebo text-8xl text-white">
				Joel Maldonado-Ruiz
			</h1>

			<ul class="flex items-center px-16">
				<li transition:fade={{ delay: 1500 }}>
					<a href="https://github.com/Joel-Maldonado" target="_blank" rel="noopener"
						><Icon icon="mdi:github" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 1700 }}></li>
				<li transition:fade={{ delay: 1900 }}>
					<a href="https://www.linkedin.com/in/joel-maldonado-ruiz/" target="_blank" rel="noopener"
						><Icon icon="mdi:linkedin" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 2100 }}></li>
				<li transition:fade={{ delay: 2300 }}>
					<a href="mailto:maldonjo@oregonstate.edu" target="_blank" rel="noopener"
						><Icon icon="mdi:email" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 2500 }}></li>
				<li transition:fade={{ delay: 2800 }}>
					<!-- TODO: Fix resume link -->
					<a href="https://drive.google.com/file/d/1dlkfjsdlksd" target="_blank" rel="noopener"
						><Icon icon="mdi:file-document" class="text-6xl text-white" /></a
					>
				</li>
			</ul>
		</div>
	{/if}
</header>

<section id="projects" class="relative min-h-screen px-4 py-20 sm:px-6 lg:px-8">
	<div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm"></div>
	<div class="relative z-10">
		<h2 class="mb-12 text-center font-heebo text-4xl font-light text-white">Featured Projects</h2>

		<div class="mx-auto max-w-3xl space-y-10">
			{#each projects as project}
				<div
					class="group overflow-hidden rounded-xl bg-neutral-800/100 backdrop-blur-sm transition-all hover:bg-neutral-700/50"
				>
					<div class="aspect-video w-full overflow-hidden">
						<img
							src={project.image}
							alt={project.title}
							class="object-fit transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
					<div class="p-6">
						<h3 class="mb-4 font-heebo text-3xl text-white">{project.title}</h3>
						<p class="mb-6 text-lg leading-relaxed text-white">{project.description}</p>

						<div class="mb-8 flex flex-wrap gap-2">
							{#each project.technologies as tech}
								<span
									class="rounded-full bg-neutral-700/50 px-4 py-1.5 text-sm font-medium text-white/80"
									>{tech}</span
								>
							{/each}
						</div>

						<div class="flex gap-6">
							<a
								href={project.github}
								class="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
								target="_blank"
								rel="noopener"
							>
								<Icon icon="mdi:github" class="text-2xl" />
								<span>View Code</span>
							</a>
							{#if project.live}
								<a
									href={project.live}
									class="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
									target="_blank"
									rel="noopener"
								>
									<Icon icon="mdi:open-in-new" class="text-2xl" />
									<span>Live Demo</span>
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:global(body) {
		background: linear-gradient(
			180deg,
			rgba(47, 47, 47, 0.3) 0%,
			rgba(47, 47, 47, 0.4) 50%,
			rgba(47, 47, 47, 0.5) 100%
		);
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
