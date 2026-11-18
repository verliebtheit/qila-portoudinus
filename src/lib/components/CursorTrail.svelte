<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	type Spark = {
		id: number;
		x: number;
		y: number;
		glyph: string;
		tone: number;
		drift: number;
	};

	const glyphs = ['✦', '♥', '✿', '•', '+'];
	let sparks = $state<Spark[]>([]);
	let nextId = 0;

	onMount(() => {
		const finePointer = matchMedia('(pointer: fine)').matches;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!finePointer || reduce) return;

		let lastX = 0;
		let lastY = 0;
		let lastTime = 0;
		let ticking = false;
		let px = 0;
		let py = 0;
		const timers = new SvelteSet<number>();

		const paint = () => {
			ticking = false;
			document.documentElement.style.setProperty('--pointer-x', `${(px * 14).toFixed(1)}px`);
			document.documentElement.style.setProperty('--pointer-y', `${(py * 14).toFixed(1)}px`);
		};

		const onMove = (event: PointerEvent) => {
			px = (event.clientX / window.innerWidth - 0.5) * 2;
			py = (event.clientY / window.innerHeight - 0.5) * 2;
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(paint);
			}

			const now = performance.now();
			const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
			if (now - lastTime < 70 || distance < 14) return;
			lastX = event.clientX;
			lastY = event.clientY;
			lastTime = now;

			const spark: Spark = {
				id: nextId++,
				x: event.clientX,
				y: event.clientY,
				glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
				tone: Math.floor(Math.random() * 4),
				drift: Math.round((Math.random() - 0.5) * 26)
			};

			sparks = [...sparks.slice(-11), spark];
			const timer = window.setTimeout(() => {
				sparks = sparks.filter((item) => item.id !== spark.id);
				timers.delete(timer);
			}, 720);
			timers.add(timer);
		};

		window.addEventListener('pointermove', onMove, { passive: true });

		return () => {
			window.removeEventListener('pointermove', onMove);
			for (const timer of timers) window.clearTimeout(timer);
			document.documentElement.style.removeProperty('--pointer-x');
			document.documentElement.style.removeProperty('--pointer-y');
		};
	});
</script>

<div class="cursor-layer" aria-hidden="true">
	{#each sparks as spark (spark.id)}
		<span
			class="cursor-spark tone-{spark.tone}"
			style="left: {spark.x}px; top: {spark.y}px; --drift: {spark.drift}px"
		>
			{spark.glyph}
		</span>
	{/each}
</div>

<style>
	.cursor-layer {
		position: fixed;
		inset: 0;
		z-index: 60;
		overflow: hidden;
		pointer-events: none;
	}

	.cursor-spark {
		position: absolute;
		font-family: var(--font-pixel);
		font-size: 13px;
		line-height: 1;
		color: var(--rose-deep, #e986a9);
		animation: spark-trail 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.cursor-spark.tone-1 {
		color: var(--plum, #493a50);
		font-size: 10px;
	}
	.cursor-spark.tone-2 {
		color: var(--sage, #b7c9a8);
		font-size: 12px;
	}
	.cursor-spark.tone-3 {
		color: var(--bubblegum, #f7b7ce);
		font-size: 15px;
	}

	@keyframes spark-trail {
		0% {
			opacity: 0.9;
			transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
		}
		35% {
			opacity: 1;
			transform: translate(-50%, -60%) scale(1) rotate(20deg);
		}
		100% {
			opacity: 0;
			transform: translate(calc(-50% + var(--drift)), -140%) scale(0.7) rotate(70deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor-layer {
			display: none;
		}
	}
</style>
