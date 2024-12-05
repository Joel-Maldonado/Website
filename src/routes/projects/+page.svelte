<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Background from '$lib/components/Background.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let projects = $state([]);
	let animate = $state(false);

	onMount(async () => {
		const response = await fetch('/api/projects');
		const data = await response.json();
		projects = data.projects;
		animate = true;
		document.title = 'Joel M. | Projects';
	});
</script>

<Background />

<div
	class="from-space-grey/10 via-space-grey/20 to-space-grey/10 min-h-screen bg-gradient-to-b backdrop-blur-sm"
>
	<div class="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl">
			<h1 class="mb-12 text-center font-heebo text-6xl text-white">Projects</h1>

			{#if animate}
				<div class="space-y-10" transition:fly={{ duration: 1000, y: 50 }}>
					{#each projects as project}
						<ProjectCard {...project} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Ensure cards have equal height in grid */
	:global(.grid > article) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
