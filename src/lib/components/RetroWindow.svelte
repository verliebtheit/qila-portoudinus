<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from '$lib/icons';
	import PixelIcon from './PixelIcon.svelte';

	type Props = {
		title: string;
		icon?: IconName;
		badge?: string;
		tone?: 'pink' | 'sage' | 'cream';
		bodyClass?: string;
		class?: string;
		children: Snippet;
	};

	let {
		title,
		icon,
		badge,
		tone = 'pink',
		bodyClass = '',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="retro-window pixel-shadow {className}">
	<div class="retro-window__bar retro-window__bar--{tone}">
		<span class="retro-window__lights" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
		</span>

		{#if icon}
			<span class="retro-window__icon" aria-hidden="true">
				<PixelIcon name={icon} size={12} />
			</span>
		{/if}

		<span class="retro-window__title">{title}</span>

		{#if badge}
			<span class="retro-window__badge">{badge}</span>
		{:else}
			<span class="retro-window__grip" aria-hidden="true">▚</span>
		{/if}
	</div>

	<div class="retro-window__body {bodyClass}">
		{@render children()}
	</div>
</div>

<style>
	.retro-window {
		border: 2px solid var(--line-strong);
		background: var(--surface);
		color: var(--ink);
	}

	.retro-window__bar {
		display: flex;
		min-height: 34px;
		align-items: center;
		gap: 0.6rem;
		border-bottom: 2px solid var(--line-strong);
		padding: 0.35rem 0.5rem;
		color: var(--plum-deep);
	}

	.retro-window__bar--pink {
		background: var(--bubblegum);
	}

	.retro-window__bar--sage {
		background: var(--sage);
	}

	.retro-window__bar--cream {
		background: var(--cream-deep);
	}

	.retro-window__lights {
		display: flex;
		gap: 3px;
		padding-left: 2px;
	}

	.retro-window__lights span {
		width: 9px;
		height: 9px;
		border: 1.5px solid var(--plum-deep);
		background: var(--surface);
		transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.retro-window__lights span:nth-child(1) {
		background: var(--rose);
	}

	.retro-window__lights span:nth-child(2) {
		background: var(--cream);
	}

	.retro-window__lights span:nth-child(3) {
		background: var(--sage);
	}

	.retro-window:hover .retro-window__lights span:nth-child(1) {
		transform: translateY(-2px);
	}

	.retro-window:hover .retro-window__lights span:nth-child(2) {
		transform: translateY(-1px);
		transition-delay: 40ms;
	}

	.retro-window:hover .retro-window__lights span:nth-child(3) {
		transition-delay: 80ms;
	}

	.retro-window__icon {
		display: grid;
		width: 18px;
		height: 18px;
		place-items: center;
		border: 1.5px solid var(--plum-deep);
		background: rgb(255 248 242 / 0.5);
	}

	.retro-window__title {
		overflow: hidden;
		flex: 1;
		font-family: var(--font-pixel);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.015em;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.retro-window__badge {
		border: 1.5px solid var(--plum-deep);
		background: var(--surface);
		padding: 0.18rem 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.5625rem;
		line-height: 1.2;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.retro-window__grip {
		padding-right: 0.15rem;
		font-size: 0.7rem;
		line-height: 1;
		opacity: 0.7;
	}

	.retro-window__body {
		background: var(--surface);
	}
</style>
