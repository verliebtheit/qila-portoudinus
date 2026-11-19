<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from '$lib/icons';
	import PixelIcon from './PixelIcon.svelte';

	type Props = {
		id: string;
		title: string;
		icon?: IconName;
		x: number;
		y: number;
		width: number;
		height: number;
		z: number;
		maximized?: boolean;
		active?: boolean;
		onFocus?: (id: string) => void;
		onMove?: (id: string, x: number, y: number) => void;
		onMinimize?: (id: string) => void;
		onMaximize?: (id: string) => void;
		onClose?: (id: string) => void;
		children: Snippet;
	};

	let {
		id,
		title,
		icon = 'star',
		x,
		y,
		width,
		height,
		z,
		maximized = false,
		active = false,
		onFocus,
		onMove,
		onMinimize,
		onMaximize,
		onClose,
		children
	}: Props = $props();

	let dragging = $state(false);
	let startPointerX = 0;
	let startPointerY = 0;
	let startX = 0;
	let startY = 0;
	let activePointerId: number | null = null;

	function beginDrag(event: PointerEvent) {
		if (maximized || activePointerId !== null) return;
		if ((event.target as HTMLElement).closest('[data-window-control]')) return;
		activePointerId = event.pointerId;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		dragging = true;
		startPointerX = event.clientX;
		startPointerY = event.clientY;
		startX = x;
		startY = y;
	}

	function drag(event: PointerEvent) {
		if (!dragging || event.pointerId !== activePointerId) return;
		onMove?.(id, startX + event.clientX - startPointerX, startY + event.clientY - startPointerY);
	}

	function endDrag(event: PointerEvent) {
		if (!dragging || event.pointerId !== activePointerId) return;
		dragging = false;
		activePointerId = null;
		const bar = event.currentTarget as HTMLElement;
		if (bar.hasPointerCapture(event.pointerId)) bar.releasePointerCapture(event.pointerId);
	}

	function handleTitleKeydown(event: KeyboardEvent) {
		if (maximized) return;
		const step = event.shiftKey ? 32 : 12;
		let dx = 0;
		let dy = 0;

		switch (event.key) {
			case 'ArrowLeft':
				dx = -step;
				break;
			case 'ArrowRight':
				dx = step;
				break;
			case 'ArrowUp':
				dy = -step;
				break;
			case 'ArrowDown':
				dy = step;
				break;
			default:
				return;
		}

		event.preventDefault();
		onMove?.(id, x + dx, y + dy);
	}
</script>

<section
	class="desktop-window {active ? 'is-active' : 'is-inactive'}"
	aria-label={title}
	style:left={`${x}px`}
	style:top={`${y}px`}
	style:width={`${width}px`}
	style:height={`${height}px`}
	style:z-index={z}
	onpointerdown={() => onFocus?.(id)}
>
	<div
		class={['titlebar', { 'is-dragging': dragging }]}
		role="toolbar"
		tabindex="0"
		aria-label={`Move ${title}`}
		onpointerdown={beginDrag}
		onpointermove={drag}
		onpointerup={endDrag}
		onpointercancel={endDrag}
		onkeydown={handleTitleKeydown}
	>
		<span class="titlebar__icon" aria-hidden="true">
			<PixelIcon name={icon} size={13} />
		</span>
		<span class="titlebar__title">{title}</span>

		<div class="titlebar__controls">
			<button
				type="button"
				data-window-control
				class="control control--minimize"
				aria-label={`Minimize ${title}`}
				title={`Minimize ${title}`}
				onclick={() => onMinimize?.(id)}
			></button>
			<button
				type="button"
				data-window-control
				class="control control--maximize"
				aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
				title={maximized ? `Restore ${title}` : `Maximize ${title}`}
				onclick={() => onMaximize?.(id)}
			></button>
			<button
				type="button"
				data-window-control
				class="control control--close"
				aria-label={`Close ${title}`}
				title={`Close ${title}`}
				onclick={() => onClose?.(id)}
			>
				<PixelIcon name="close" size={10} />
			</button>
		</div>
	</div>

	<div class="body">
		{@render children?.()}
	</div>
</section>

<style>
	.desktop-window {
		position: absolute;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 3px solid var(--line-strong);
		background: var(--surface);
		box-shadow: 6px 6px 0 0 var(--shadow);
		color: var(--ink);
		transition: box-shadow 180ms ease;
	}

	.desktop-window.is-active {
		box-shadow: 9px 9px 0 0 var(--shadow);
	}

	.titlebar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.5rem;
		min-height: 38px;
		border-bottom: 3px solid var(--line-strong);
		background: var(--bubblegum-soft);
		padding: 0.25rem 0.4rem 0.25rem 0.5rem;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		cursor: grab;
	}

	.is-active .titlebar {
		background: var(--bubblegum);
	}

	.titlebar.is-dragging {
		cursor: grabbing;
	}

	.titlebar__icon {
		display: grid;
		width: 20px;
		height: 20px;
		place-items: center;
		border: 2px solid var(--plum-deep);
		background: var(--surface);
		color: var(--rose-deep);
	}

	.titlebar__title {
		overflow: hidden;
		flex: 1;
		font-family: var(--font-pixel);
		font-size: 0.95rem;
		line-height: 1;
		color: var(--plum-deep);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.titlebar__controls {
		display: flex;
		flex: none;
		gap: 4px;
	}

	.control {
		display: grid;
		width: 20px;
		height: 20px;
		place-items: center;
		border: 2px solid var(--plum-deep);
		background: var(--cream);
		padding: 0;
		color: var(--plum-deep);
		transition: transform 150ms ease;
	}

	.control--minimize {
		background: var(--sage);
	}

	.control--maximize {
		background: var(--cream);
	}

	.control--close {
		background: var(--rose);
	}

	.control:hover {
		transform: translateY(-2px);
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		background: var(--surface);
		padding: 1rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.desktop-window,
		.control {
			transition: none;
		}
	}
</style>
