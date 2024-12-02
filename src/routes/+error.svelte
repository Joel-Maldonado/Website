<script>
	import { page } from '$app/stores';
	import Background from '$lib/components/Background.svelte';
</script>

<div class="relative min-h-screen bg-space-grey/20">
	<div class="relative z-10 flex h-screen flex-col items-center justify-center px-4 text-center">
		<h1 class="font-heebo text-8xl font-bold text-white">{$page.status}</h1>
		<p class="mt-4 text-xl text-white/80">{$page.error?.message || 'Page not found'}</p>
		<a
			href="/"
			class="mt-8 rounded-lg bg-neutral-800/80 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-neutral-700/80"
		>
			Go back home
		</a>
	</div>
</div>
