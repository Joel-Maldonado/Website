<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let {
		circleCount = 5,
		baseSpeed = 0.02,
		rangeSpeed = 0.03,
		baseRadius = 40,
		rangeRadius = 60,
		parallaxStrength = 0.8,
		blurAmount = 50,
		initialDelay = 0,
		baseTTL = 700,
		rangeTTL = 1000,
		centerBias = 0.15,
		connectionDistance = 1000,
		burstSpeedMultiplier = 1,
		burstDuration = 0,
		burstBaseRadius = 50,
		burstRangeRadius = 60
	} = $props();

	circleCount = Number(circleCount);
	blurAmount = Number(blurAmount);
	initialDelay = Number(initialDelay);
	baseTTL = Number(baseTTL);
	rangeTTL = Number(rangeTTL);
	burstSpeedMultiplier = Number(burstSpeedMultiplier);
	burstDuration = Number(burstDuration);
	burstBaseRadius = Number(burstBaseRadius);
	burstRangeRadius = Number(burstRangeRadius);

	const circlePropCount = 8;
	const circlePropsLength = circleCount * circlePropCount;
	const rangeHue = 10;
	const xOff = 0.0015;
	const yOff = 0.0015;
	const zOff = 0.0015;
	const backgroundColor = 'transparent';
	const TAU = Math.PI * 2;
	let scrollY = 0;

	let container;
	let canvasA;
	let canvasB;
	let circleProps;
	let baseHue;
	let animationFrame;
	let isReady = $state(false);
	let isBurst = $state(true);

	const rand = (n) => n * Math.random();
	const fadeInOut = (t, m) => {
		let hm = 0.5 * m;
		let rt = t % m;
		let f = Math.abs(((rt + hm) % m) - hm) / hm;
		return f * f * (3 - 2 * f);
	};

	function initCircle(i) {
		let x, y;

		if (Math.random() < centerBias) {
			x = canvasA.width * (0.5 + (Math.random() + Math.random() - 1) * 0.3);
			y = canvasA.height * (0.5 + (Math.random() + Math.random() - 1) * 0.3);
		} else {
			x = rand(canvasA.width);
			y = rand(canvasA.height);
		}

		let n = Math.random();
		let t = rand(TAU);
		let speed = baseSpeed + rand(rangeSpeed);
		let vx = speed * Math.cos(t);
		let vy = speed * Math.sin(t);
		let life = 0;
		let ttl = baseTTL + rand(rangeTTL);

		let radius;
		if (isBurst) {
			radius = (burstBaseRadius + rand(burstRangeRadius)) * 0.2;
		} else {
			radius = (baseRadius + rand(rangeRadius)) * 0.2;
		}

		let hue = baseHue + n * rangeHue;

		circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
	}

	function initCircles() {
		circleProps = new Float32Array(circlePropsLength);
		baseHue = 220;

		for (let i = 0; i < circlePropsLength; i += circlePropCount) {
			initCircle(i);
			circleProps[i + 4] = (i / circlePropCount) * (baseTTL / circleCount);
		}
	}

	function checkBounds(x, y, radius) {
		const padding = radius * 2;
		return (
			x < -padding || x > canvasA.width + padding || y < -padding || y > canvasA.height + padding
		);
	}

	function updateCircle(i) {
		const ctxA = canvasA.getContext('2d');

		let i2 = 1 + i,
			i3 = 2 + i,
			i4 = 3 + i,
			i5 = 4 + i,
			i6 = 5 + i,
			i7 = 6 + i,
			i8 = 7 + i;
		let x = circleProps[i];
		let y = circleProps[i2];
		let vx = circleProps[i3];
		let vy = circleProps[i4];
		let life = circleProps[i5];
		let ttl = circleProps[i6];
		let radius = circleProps[i7];
		let hue = circleProps[i8];

		const parallaxOffset = scrollY * parallaxStrength;
		const adjustedY = y - parallaxOffset;

		ctxA.save();
		const fadeMultiplier = life > ttl - 100 ? 0.15 : 0.2;
		ctxA.fillStyle = `hsla(0, 0%, 100%, ${fadeInOut(life, ttl) * fadeMultiplier})`;
		ctxA.beginPath();
		ctxA.arc(x, adjustedY, radius, 0, TAU);
		ctxA.fill();
		ctxA.closePath();
		ctxA.restore();

		if (isBurst) {
			life += burstSpeedMultiplier;
		} else {
			life++;
		}

		if (life < 50) {
			radius = radius * 1.05;
			circleProps[i7] = radius;
		}

		circleProps[i] = x + vx;
		circleProps[i2] = y + vy;
		circleProps[i5] = life;

		if (checkBounds(x, y, radius) || life > ttl) {
			initCircle(i);
		}
	}

	function drawConnections() {
		const ctxA = canvasA.getContext('2d');

		for (let i = 0; i < circlePropsLength; i += circlePropCount) {
			const x1 = circleProps[i];
			const y1 = circleProps[i + 1];

			for (let j = i + circlePropCount; j < circlePropsLength; j += circlePropCount) {
				const x2 = circleProps[j];
				const y2 = circleProps[j + 1];

				const dx = x2 - x1;
				const dy = y2 - y1;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < connectionDistance) {
					const opacity = (1 - distance / connectionDistance) * 0.15;
					ctxA.beginPath();
					ctxA.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
					ctxA.lineWidth = 1;
					ctxA.moveTo(x1, y1);
					ctxA.lineTo(x2, y2);
					ctxA.stroke();
				}
			}
		}
	}

	function updateCircles() {
		baseHue += 0.1;

		for (let i = 0; i < circlePropsLength; i += circlePropCount) {
			updateCircle(i);
		}

		drawConnections();
	}

	function render() {
		const ctxA = canvasA.getContext('2d');
		const ctxB = canvasB.getContext('2d');

		ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
		ctxB.fillStyle = backgroundColor;
		ctxB.fillRect(0, 0, canvasB.width, canvasB.height);

		updateCircles();

		ctxB.save();
		ctxB.filter = `blur(${blurAmount}px)`;
		ctxB.globalAlpha = 0.8;
		ctxB.drawImage(canvasA, 0, 0);
		ctxB.restore();

		animationFrame = requestAnimationFrame(render);
	}

	function resize() {
		if (!browser) return;
		const { innerWidth, innerHeight } = window;

		canvasA.width = innerWidth;
		canvasA.height = innerHeight;

		canvasB.width = innerWidth;
		canvasB.height = innerHeight;
	}

	onMount(() => {
		if (!browser) return;

		// Create and setup canvases immediately
		canvasA = document.createElement('canvas');
		canvasB = document.createElement('canvas');

		// Set canvas styles before appending
		canvasB.style.position = 'fixed';
		canvasB.style.top = '0';
		canvasB.style.left = '0';
		canvasB.style.width = '100%';
		canvasB.style.height = '100%';
		canvasB.style.opacity = '0'; // Start invisible
		canvasB.style.transition = 'opacity 1000ms';
		canvasB.style.backgroundColor = backgroundColor;

		container.appendChild(canvasB);

		resize();
		initCircles();

		// Start render immediately but keep canvas invisible
		render();

		// After initial delay, fade in the canvas
		setTimeout(() => {
			canvasB.style.opacity = '1';

			setTimeout(() => {
				isReady = true;
				isBurst = false;
			}, 1000); // Wait for fade in to complete
		}, initialDelay);

		const handleScroll = () => {
			scrollY = window.pageYOffset;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', resize, { passive: true }); // Added resize listener

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', resize);
		};
	});

	onDestroy(() => {
		if (!browser) return;
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<div bind:this={container} class="pointer-events-none fixed inset-0 h-[800px] w-full"></div>

<style>
	div {
		z-index: -1;
	}
</style>
