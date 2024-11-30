<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Background from '$lib/components/Background.svelte';

	let animate = $state(false);
	onMount(() => {
		animate = true;
	});
</script>

<header class="relative h-screen overflow-hidden bg-black/40 p-12 text-center">
	<Background />

	{#if animate}
		<div class="relative z-10 flex h-full flex-col items-center justify-center gap-6">
			<h1 in:fly={{ y: -40, duration: 2300 }} class="font-heebo text-8xl text-white">
				Joel Maldonado-Ruiz
			</h1>

			<ul class="flex items-center px-16">
				<li transition:fade={{ delay: 1500 }}>
					<a href="https://github.com/Joel-Maldonado" target="_blank" rel="noopener"
						><Icon icon="mdi:github" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 1700 }}></li>
				<li transition:fade={{ delay: 1900 }}>
					<a href="https://www.linkedin.com/in/joel-maldonado-ruiz/" target="_blank" rel="noopener"
						><Icon icon="mdi:linkedin" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 2100 }}></li>
				<li transition:fade={{ delay: 2300 }}>
					<a href="mailto:maldonjo@oregonstate.edu" target="_blank" rel="noopener"
						><Icon icon="mdi:email" class="text-6xl text-white" /></a
					>
				</li>
				<li class="mx-4 h-12 w-px bg-white/20" transition:fade={{ delay: 2500 }}></li>
				<li transition:fade={{ delay: 2800 }}>
					<!-- TODO: Fix resume link -->
					<a href="https://drive.google.com/file/d/1dlkfjsdlksd" target="_blank" rel="noopener"
						><Icon icon="mdi:file-document" class="text-6xl text-white" /></a
					>
				</li>
			</ul>
		</div>
	{/if}
</header>
