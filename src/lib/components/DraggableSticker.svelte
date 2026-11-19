<script lang="ts">
	import { onMount } from 'svelte';
	import type { IconName } from '$lib/icons';
	import PixelIcon from './PixelIcon.svelte';

	type Props = {
		icon: IconName;
		label: string;
		x: number;
		y: number;
		size?: number;
		tone?: string;
		onMove?: (x: number, y: number) => void;
		onRelease?: (x: number, y: number) => void;
		onBump?: () => void;
	};

	let {
		icon,
		label,
		x,
		y,
		size = 32,
		tone = 'text-rose-deep',
		onMove,
		onRelease,
		onBump
	}: Props = $props();

	let dragging = $state(false);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let reduced = $state(false);

	let startPointerX = 0;
	let startPointerY = 0;
	let startX = 0;
	let startY = 0;
	let lastX = 0;
	let lastY = 0;
	let lastT = 0;
	let velocityX = 0;
	let velocityY = 0;
	let moved = false;
	let activePointerId: number | null = null;

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => (reduced = mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	function handlePointerDown(event: PointerEvent) {
		if (activePointerId !== null) return;
		activePointerId = event.pointerId;
		(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
		dragging = true;
		moved = false;
		startPointerX = event.clientX;
		startPointerY = event.clientY;
		startX = x;
		startY = y;
		lastX = event.clientX;
		lastY = event.clientY;
		lastT = event.timeStamp;
		velocityX = 0;
		velocityY = 0;
		offsetX = 0;
		offsetY = 0;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!dragging || event.pointerId !== activePointerId) return;
		offsetX = event.clientX - startPointerX;
		offsetY = event.clientY - startPointerY;
		if (Math.abs(offsetX) > 4 || Math.abs(offsetY) > 4) moved = true;

		const dt = event.timeStamp - lastT;
		if (dt > 0) {
			const dx = event.clientX - lastX;
			const dy = event.clientY - lastY;
			velocityX = velocityX * 0.4 + (dx / dt) * 0.6;
			velocityY = velocityY * 0.4 + (dy / dt) * 0.6;
			lastX = event.clientX;
			lastY = event.clientY;
			lastT = event.timeStamp;
		}

		onMove?.(startX + offsetX, startY + offsetY);
	}

	function inertialOffset(velocity: number): number {
		if (reduced) return 0;
		return Math.max(-26, Math.min(26, velocity * 14));
	}

	function finishDrag(event: PointerEvent, cancelled = false) {
		if (!dragging || event.pointerId !== activePointerId) return;
		dragging = false;
		activePointerId = null;

		const button = event.currentTarget as HTMLButtonElement;
		if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);

		if (!moved) {
			offsetX = 0;
			offsetY = 0;
			return;
		}

		const ix = cancelled ? 0 : inertialOffset(velocityX);
		const iy = cancelled ? 0 : inertialOffset(velocityY);
		onRelease?.(startX + offsetX + ix, startY + offsetY + iy);

		offsetX = 0;
		offsetY = 0;
		velocityX = 0;
		velocityY = 0;
	}

	function handleClick() {
		if (moved) {
			moved = false;
			return;
		}
		onBump?.();
	}
</script>

<button
	type="button"
	class="sticker {tone} {dragging ? 'is-dragging' : ''} {reduced ? 'is-reduced' : ''}"
	style:left={`${x}px`}
	style:top={`${y}px`}
	style:width={`${size}px`}
	style:height={`${size}px`}
	aria-label={label}
	title={label}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={(event) => finishDrag(event)}
	onpointercancel={(event) => finishDrag(event, true)}
	onclick={handleClick}
>
	<PixelIcon name={icon} {size} class="h-full w-full" />
</button>

<style>
	.sticker {
		position: absolute;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		pointer-events: auto;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		cursor: grab;
		transform: rotate(0deg) scale(1);
		transform-origin: center;
		transition: transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: drop-shadow(2px 2px 0 var(--shadow));
	}

	.sticker:hover {
		filter: drop-shadow(3px 3px 0 var(--shadow));
	}

	.sticker.is-dragging {
		cursor: grabbing;
		transform: rotate(8deg) scale(1.08);
		transition: none;
		z-index: 5;
	}

	.sticker.is-reduced {
		transition: none;
	}
</style>
