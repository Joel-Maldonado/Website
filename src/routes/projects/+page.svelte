<script>
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Background from '$lib/components/Background.svelte';
	import { fade, fly } from 'svelte/transition';

	let projects = $state([]);
	let animate = $state(false);

	onMount(async () => {
		const response = await fetch('/api/projects');
		const data = await response.json();
		projects = data.projects;
		animate = true;
	});
</script>

<div class="min-h-screen bg-gradient-to-b from-space-grey/10 via-space-grey/20 to-space-grey/10">
	<Background
		circleCount={7}
		blurAmount={120}
		initialDelay={0}
		baseTTL={700}
		rangeTTL={1000}
		centerBias={0.5}
		baseRadius={30}
		rangeRadius={70}
		baseSpeed={0.15}
		rangeSpeed={0.4}
		connectionDistance={1000}
		forceSpawnSingleMiddle={true}
		middleRadius={500}
		burstDuration={0}
	/>

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
