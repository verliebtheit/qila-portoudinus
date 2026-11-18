<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from '$lib/icons';
	import PixelIcon from './PixelIcon.svelte';

	let {
		title,
		icon = 'star',
		as = 'section',
		id,
		class: className = '',
		children
	}: {
		title: string;
		icon?: IconName;
		as?: keyof HTMLElementTagNameMap;
		id?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<svelte:element this={as} {id} class={`pixel-border bg-surface ${className}`}>
	<div class="window-titlebar flex items-center justify-between gap-3 px-3 py-2">
		<div class="flex min-w-0 items-center gap-2">
			<span
				class="grid h-6 w-6 shrink-0 place-items-center border-2 border-line-strong bg-surface text-plum"
				aria-hidden="true"
			>
				<PixelIcon name={icon} size={14} />
			</span>
			<h2 class="truncate font-pixel text-lg leading-none text-plum sm:text-xl">{title}</h2>
		</div>

		<div class="flex items-center gap-1.5" aria-hidden="true">
			<span class="block h-3 w-3 border-2 border-line-strong bg-cream"></span>
			<span class="block h-3 w-3 border-2 border-line-strong bg-sage"></span>
			<span class="block h-3 w-3 border-2 border-line-strong bg-rose"></span>
		</div>
	</div>

	<div class="p-4 sm:p-6">
		{@render children?.()}
	</div>
</svelte:element>
