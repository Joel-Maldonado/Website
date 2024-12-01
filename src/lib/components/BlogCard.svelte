<script>
	let { title, description, date, readTime, tags, image, slug } = $props();
</script>

<article
	class="group overflow-hidden rounded-lg bg-neutral-800/100 backdrop-blur-sm transition-all hover:bg-neutral-700/50"
>
	{#if image}
		<div class="aspect-[16/9] w-full overflow-hidden">
			<img
				src={image}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{/if}
	<div class="p-4">
		<div class="mb-2 flex items-center gap-2 text-xs text-white/60">
			<span>{date}</span>
			<span>•</span>
			<span>{readTime}</span>
		</div>

		<h2 class="mb-2 font-heebo text-xl text-white">
			<a href={`/blog/${slug}`} class="hover:text-blue-400">
				{title}
			</a>
		</h2>

		<p class="mb-4 line-clamp-3 text-sm leading-relaxed text-white/80">
			{description}
		</p>

		<div class="flex flex-wrap gap-1">
			{#each tags as tag}
				<span class="rounded-full bg-neutral-700/50 px-2 py-1 text-xs font-medium text-white/80">
					{tag}
				</span>
			{/each}
		</div>
	</div>
</article>
