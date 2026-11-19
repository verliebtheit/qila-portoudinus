<script lang="ts">
	import type { Project } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import ProjectArt from './ProjectArt.svelte';

	let { project, index = 0 }: { project: Project; index?: number } = $props();

	const previewText = $derived(
		project.label ?? project.title.toLowerCase().replace(/\s+/g, '_') + '.exe'
	);
</script>

<article
	use:reveal={{ delay: 70 + index * 90 }}
	class="pixel-border-sm group flex h-full flex-col bg-surface p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--shadow)]"
	aria-label={project.title}
>
	<!-- Animated mini-scene container -->
	<div
		class="relative mb-4 flex aspect-[16/11] min-h-[210px] w-full items-center justify-center overflow-hidden border-2 border-line-strong bg-cream shadow-[2px_2px_0_0_var(--shadow)]"
	>
		{#if project.scene}
			<ProjectArt kind={project.scene} class="h-full w-full" />
		{:else if project.image}
			<img src={project.image} alt="" class="h-full w-full object-cover" loading="lazy" />
		{:else}
			<div class="flex flex-col items-center gap-2 text-plum/70" aria-hidden="true">
				<span class="font-pixel text-4xl">▣</span>
				<span class="font-mono text-sm sm:text-base">{previewText}</span>
			</div>
		{/if}
		<span
			class="pointer-events-none absolute top-2 left-2 z-10 border-2 border-line-strong bg-pink px-2 py-0.5 font-mono text-[10px] tracking-wide text-plum-deep uppercase shadow-[1px_1px_0_0_var(--shadow)]"
		>
			{project.label ?? 'preview'}
		</span>
	</div>

	<!-- Info section -->
	<div class="flex flex-1 flex-col gap-2">
		<h3 class="font-pixel text-2xl leading-tight text-ink">{project.title}</h3>
		<p class="text-[15px] leading-relaxed text-muted">{project.description}</p>

		{#if project.tech && project.tech.length > 0}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each project.tech as t (t)}
					<span
						class="border border-line-strong bg-cream px-2 py-0.5 font-mono text-[10px] text-ink"
					>
						{t}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Footer status & link -->
	<div
		class="mt-4 flex items-center justify-between gap-3 border-t-2 border-dotted border-line-soft pt-3 font-mono text-xs text-muted"
	>
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2 w-2 rounded-full bg-success" aria-hidden="true"></span>
			<span>interactive demo</span>
		</span>
		{#if project.href}
			<a
				href={project.href}
				target="_blank"
				rel="external noopener noreferrer"
				class="font-pixel text-sm text-rose-deep underline decoration-dotted hover:text-ink"
			>
				open ↗
			</a>
		{:else}
			<span class="font-mono text-[11px] text-rose-deep/90">click scene to play ✦</span>
		{/if}
	</div>
</article>
