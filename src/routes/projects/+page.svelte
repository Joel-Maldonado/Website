<script>
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Background from '$lib/components/Background.svelte';

	let projects = $state([]);

	onMount(async () => {
		const response = await fetch('/api/projects');
		const data = await response.json();
		projects = data.projects;
	});
</script>

<div class="min-h-screen bg-space-grey/10">
	<Background />

	<div class="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl">
			<h1 class="mb-12 text-center font-heebo text-6xl text-white">Projects</h1>

			<div class="space-y-10">
				{#each projects as project}
					<ProjectCard {...project} />
				{/each}
			</div>
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
