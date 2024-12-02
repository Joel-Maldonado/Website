<script>
	import Icon from '@iconify/svelte';

	let { title, description, image, technologies, github, live } = $props();
</script>

<article
	class="group overflow-hidden rounded-lg bg-neutral-800 shadow-lg shadow-black backdrop-blur-sm transition-all hover:bg-neutral-700"
>
	{#if image}
		<div class="aspect-video w-full overflow-hidden">
			<img
				src={`src/lib/images/${image}`}
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
					class="rounded-full bg-neutral-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-500 group-hover:bg-neutral-600"
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
