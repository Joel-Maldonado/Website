<script>
	import Icon from '@iconify/svelte';

	let { title, description, image, technologies, github, live } = $props();
</script>

<article
	class="bg-space-grey-600/100 hover:bg-space-grey-500 group overflow-hidden rounded-lg shadow-lg shadow-black/50 backdrop-blur-sm transition-all"
>
	{#if image}
		<div class="aspect-video w-full overflow-hidden">
			<img
				src={`images/${image}`}
				alt={title}
				class="h-full w-full object-scale-down transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{/if}
	<div class="p-6">
		<h3 class="mb-4 font-heebo text-3xl text-white">{title}</h3>
		<p class="mb-6 text-lg leading-relaxed text-white">{description}</p>

		<div class="mb-8 flex flex-wrap gap-2">
			{#each technologies as tech}
				<span
					class="hover:bg-space-grey-500 group-hover:bg-space-grey-500 rounded-full bg-space-grey px-4 py-1.5 text-sm font-medium text-white/90 transition-colors"
				>
					{tech}
				</span>
			{/each}
		</div>

		<div class="flex gap-6">
			<a
				href={github}
				class="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
				target="_blank"
				rel="noopener"
			>
				<Icon icon="mdi:github" class="text-2xl" />
				<span>View Code</span>
			</a>
			{#if live}
				<a
					href={live}
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
</article>
