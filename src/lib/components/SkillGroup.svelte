<script lang="ts">
	import type { SkillGroup } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';

	type Props = {
		group: SkillGroup;
		index: number;
	};

	let { group, index }: Props = $props();
</script>

<article
	use:reveal={{ delay: 60 + index * 90 }}
	class="pixel-border-sm flex h-full flex-col bg-cream p-4"
	aria-label={group.title}
>
	<div class="mb-3 flex items-center justify-between gap-2 border-b-2 border-dotted border-line-soft pb-2">
		<h3 class="font-pixel text-2xl text-ink">{group.title}</h3>
		<span aria-hidden="true" class="text-rose-deep">✦</span>
	</div>
	<p class="mb-4 text-sm leading-relaxed text-muted">{group.note}</p>
	<ul class="mt-auto flex flex-wrap gap-2">
		{#each group.items as item (item)}
			<li
				class="inline-flex items-center gap-1.5 border-2 border-line-strong bg-surface px-3 py-1.5 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--shadow)]"
			>
				<span aria-hidden="true" class="text-rose-deep">✓</span>
				{item}
			</li>
		{/each}
	</ul>
</article>
