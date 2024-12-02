<script>
	import Background from '$lib/components/Background.svelte';
	import { onMount } from 'svelte';
	import '$lib/themes/atom-dark.css';

	let { data } = $props();

	let slug = data.slug;
	const post = new Promise(async (resolve, reject) => {
		try {
			const post = await import(`../../../lib/blogs-md/${slug}.md`);
			resolve(post);
		} catch (error) {
			reject(error);
		}
	});

	const formatDate = (dateStr) => {
		const date = new Date(dateStr.replace('/', '-'));
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<div class="min-h-screen bg-space-grey/20">
	<div class="flex justify-center p-4 sm:p-6 lg:p-8">
		<div class="relative mt-5 w-[850px] rounded-lg">
			<div class="relative z-10 px-6 py-12 sm:px-8 lg:px-12">
				<article class="prose prose-invert mx-auto max-w-3xl">
					<header class="mb-8 text-center">
						<h1 class="mb-2 font-heebo text-4xl text-white">{data.metadata.title}</h1>
						<div class=" text-lg text-white/60">
							<time datetime={data.metadata.date}>{formatDate(data.metadata.date)}</time>
							<span class="mx-2">•</span>
							<span>{data.metadata.author}</span>
						</div>
					</header>

					<div class="mt-8 text-lg">
						{#await post}
							<p>Loading...</p>
						{:then post}
							<post.default />
						{:catch error}
							<p>{error.message}</p>
						{/await}
					</div>
				</article>
			</div>
		</div>
	</div>
</div>
