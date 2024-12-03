<script>
	import { page } from '$app/stores';
	import Background from '$lib/components/Background.svelte';
</script>

<div class="bg-space-grey-500/20 relative min-h-screen">
	<div class="relative z-10 flex h-screen flex-col items-center justify-center px-4 text-center">
		<h1 class="font-heebo text-8xl font-bold text-white">{$page.status}</h1>
		<p class="mt-4 text-xl text-white/80">{$page.error?.message || 'Page not found'}</p>
		<a
			href="/"
			class="bg-space-grey-600 hover:bg-space-grey-500 mt-8 rounded-lg px-6 py-3 text-lg font-medium text-white transition-colors"
		>
			Go back home
		</a>
	</div>
</div>
