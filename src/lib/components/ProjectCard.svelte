<script>
	import Icon from '@iconify/svelte';

	let { title, description, image, technologies, github, live, size = 'medium' } = $props();

	const sizeClasses = {
		title: {
			small: 'text-2xl',
			medium: 'text-3xl',
			large: 'text-4xl'
		},
		description: {
			small: 'text-base',
			medium: 'text-lg',
			large: 'text-xl'
		},
		padding: {
			small: 'p-4',
			medium: 'p-6',
			large: 'p-8'
		}
	};
</script>

<article
	class="group overflow-hidden rounded-lg bg-space-grey-600/100 shadow-lg shadow-black/50 backdrop-blur-sm transition-all hover:bg-space-grey-500"
>
	{#if image}
		<div class="aspect-[5/3] w-full overflow-hidden">
			<img
				src={`images/${image}`}
				alt={title}
				class="h-full w-full object-scale-down object-center transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{/if}

	<div class={sizeClasses.padding[size] + ' space-y-2'}>
		<h3 class="font-heebo {sizeClasses.title[size]} text-white">{title}</h3>
		<p class="{sizeClasses.description[size]} line-clamp-3 leading-relaxed text-white/90">
			{description}
		</p>

		<div class="flex flex-wrap gap-1">
			{#each technologies as tech}
				<span
					class="rounded-full bg-space-grey-500 px-3 py-1 text-sm font-medium text-white/90 transition-all group-hover:bg-space-grey-400/20"
				>
					{tech}
				</span>
			{/each}
		</div>

		<div class="flex gap-4 pt-2">
			<a
				href={github}
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-white/80 transition-all hover:bg-space-grey-700 hover:text-white"
				target="_blank"
				rel="noopener"
			>
				<Icon icon="mdi:github" class="text-2xl" />
				<span>View Code</span>
			</a>
			{#if live}
				<a
					href={live}
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-white/80 transition-all hover:bg-space-grey-700 hover:text-white"
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
