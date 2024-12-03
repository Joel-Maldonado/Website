<script>
	import { fade } from 'svelte/transition';
</script>

<div
	class="flex h-screen flex-col items-center justify-center gap-4 text-center text-white"
	in:fade
>
	<h1 class="mb-4 text-4xl">🚧 Under Construction 🚧</h1>
	<p>About page is still in the works!</p>
	<p class="italic text-gray-200">Trying to keep it brief... which isn't my strong suit.</p>
	<a
		href="/"
		class="bg-space-grey-500 hover:bg-space-grey-450 mt-8 rounded-md px-6 py-3 text-white transition-colors"
	>
		Back to Home
	</a>
</div>
