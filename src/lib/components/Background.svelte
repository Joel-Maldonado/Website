<script>
	import { onMount } from 'svelte';

	let canvas;
	let ctx;
	let animationId;
	let time = 0;
	let scrollY = 0;
	const parallaxFactor = -0.2;

	function handleScroll() {
		scrollY = window.scrollY;
	}

	function animate() {
		time += 0.002;
		ctx.fillStyle = 'transparent';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Base scale that grows with scroll
		const baseScale = 1 + (scrollY * parallaxFactor) / canvas.height;

		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.moveTo(0, canvas.height);

			// Modified wave parameters for uniform scaling
			for (let x = 0; x <= canvas.width; x += 5) {
				const baseAmplitude = 80 - i * 15;
				const wavePhase = x * 0.002 + time + i * 0.7;
				// Apply scale to final position rather than just amplitude
				const y = Math.sin(wavePhase) * baseAmplitude * baseScale;
				// Move wave center point down as it grows
				const centerOffset = (baseScale - 1) * 100; // Adjust 100 to control downward shift
				ctx.lineTo(x, canvas.height * 0.6 + y + centerOffset);
			}

			ctx.lineTo(canvas.width, canvas.height);
			ctx.closePath();

			// Adjust opacity inversely with scale to maintain visibility
			const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
			// Increased base opacity from 0.2 to 0.4
			const opacity = (0.4 - i * 0.05) / Math.pow(baseScale, 0.5);
			gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
			gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.6})`); // Increased multiplier from 0.5 to 0.7
			gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

			ctx.fillStyle = gradient;
			ctx.fill();
		}

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		window.addEventListener('scroll', handleScroll);

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		animate();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<canvas bind:this={canvas} class="fixed left-0 top-0 -z-[1] h-screen"></canvas>
