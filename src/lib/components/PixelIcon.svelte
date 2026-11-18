<script lang="ts">
	import { pixelIcons, type IconName } from '$lib/icons';

	let {
		name,
		size = 16,
		class: className = '',
		title
	}: { name: IconName; size?: number; class?: string; title?: string } = $props();

	const uid = $props.id();
	const icon = $derived(pixelIcons[name]);
	const maskId = $derived(`pixel-icon-${uid}`);
</script>

<svg
	viewBox="0 0 16 16"
	width={size}
	height={size}
	class={className}
	shape-rendering="crispEdges"
	role={title ? 'img' : undefined}
	aria-hidden={title ? undefined : 'true'}
	aria-label={title}
	focusable="false"
>
	{#if title}
		<title>{title}</title>
	{/if}

	{#if icon.detail?.length}
		<defs>
			<mask id={maskId} x="0" y="0" width="16" height="16" maskUnits="userSpaceOnUse">
				<rect width="16" height="16" fill="#fff" />
				{#each icon.detail as [x, y, w, h], i (i)}
					<rect {x} {y} width={w} height={h} fill="#000" />
				{/each}
			</mask>
		</defs>
	{/if}

	<g mask={icon.detail?.length ? `url(#${maskId})` : undefined}>
		{#each icon.base as [x, y, w, h], i (i)}
			<rect {x} {y} width={w} height={h} fill="currentColor" />
		{/each}
	</g>

	{#if icon.core}
		{#each icon.core as [x, y, w, h], i (i)}
			<rect {x} {y} width={w} height={h} fill="currentColor" />
		{/each}
	{/if}
</svg>

<style>
	svg {
		display: inline-block;
		flex: none;
	}
</style>
