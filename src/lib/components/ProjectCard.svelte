<script lang="ts">
	import type { Project } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';

	let { project, index = 0 }: { project: Project; index?: number } = $props();

	const previewText = $derived(
		project.label ?? project.title.toLowerCase().replace(/\s+/g, '_') + '.exe'
	);
</script>

{#snippet content()}
	<div class="flex h-full flex-col">
		<div
			class="relative mb-4 flex aspect-[16/10] items-center justify-center overflow-hidden border-2 border-dashed border-line-soft bg-cream retro-dots"
		>
			{#if project.image}
				<img src={project.image} alt="" class="h-full w-full object-cover" loading="lazy" />
			{:else}
				<div class="flex flex-col items-center gap-2 text-plum/70" aria-hidden="true">
					<span class="font-pixel text-4xl">▣</span>
					<span class="font-mono text-sm sm:text-base">{previewText}</span>
				</div>
			{/if}
			<span
				class="absolute left-2 top-2 border-2 border-line-strong bg-pink px-2 py-0.5 font-mono text-[10px] tracking-wide text-plum-deep uppercase"
			>
				{project.label ?? 'preview'}
			</span>
		</div>

		<div class="flex flex-1 flex-col gap-2">
			<h3 class="font-pixel text-2xl leading-tight text-ink">{project.title}</h3>
			<p class="text-[15px] leading-relaxed text-muted">{project.description}</p>
		</div>

		<div
			class="mt-4 flex items-center justify-between gap-3 border-t-2 border-dotted border-line-soft pt-3 font-mono text-xs text-muted"
		>
			<span>status: showcased</span>
			{#if project.href}
				<span class="font-pixel text-sm text-rose-deep">open ↗</span>
			{:else}
				<span>no link yet</span>
			{/if}
		</div>
	</div>
{/snippet}

{#if project.href}
	<a
		use:reveal={{ delay: 70 + index * 90 }}
		href={project.href}
		target="_blank"
		rel="noopener noreferrer"
		class="pixel-border-sm group block h-full bg-surface p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--shadow)] focus-visible:-translate-y-1"
		aria-label={`Open ${project.title}`}
	>
		{@render content()}
	</a>
{:else}
	<article
		use:reveal={{ delay: 70 + index * 90 }}
		class="pixel-border-sm group h-full bg-surface p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--shadow)]"
		aria-label={project.title}
	>
		{@render content()}
	</article>
{/if}
