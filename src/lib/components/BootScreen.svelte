<script lang="ts">
	import { onMount } from 'svelte';
	import PixelIcon from './PixelIcon.svelte';

	/** Just a stable list for the decorative loading blocks. */
	const blocks = Array.from({ length: 12 }, (_, i) => i);

	function finish() {
		document.documentElement.classList.remove('is-booting');
		try {
			sessionStorage.setItem('qila.boot', 'done');
		} catch {
			// Storage may be unavailable; the intro just won't be remembered.
		}
	}

	onMount(() => {
		if (!document.documentElement.classList.contains('is-booting')) return;

		const timer = window.setTimeout(finish, 1500);
		return () => window.clearTimeout(timer);
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (!document.documentElement.classList.contains('is-booting')) return;
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') finish();
	}}
/>

<div class="boot-screen" role="status" aria-live="polite">
	<div class="pixel-shadow-lg w-full max-w-md border-2 border-line-strong bg-surface">
		<div
			class="flex items-center gap-2 border-b-2 border-line-strong bg-primary px-3 py-2 text-on-primary"
		>
			<span class="flex gap-1" aria-hidden="true">
				<span class="size-2 border border-plum bg-rose"></span>
				<span class="size-2 border border-plum bg-cream"></span>
				<span class="size-2 border border-plum bg-sage"></span>
			</span>
			<span class="font-pixel text-sm">qila.exe — startup</span>
		</div>

		<div class="p-5 sm:p-6">
			<div class="flex items-center gap-4">
				<div
					class="grid size-16 shrink-0 place-items-center border-2 border-line-strong bg-primary text-on-primary"
					aria-hidden="true"
				>
					<PixelIcon name="smiley" size={38} />
				</div>
				<div>
					<p class="font-pixel text-2xl leading-none text-ink">loading qila.exe...</p>
					<p
						class="mt-2 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted uppercase"
					>
						pink pixels + big curiosity
					</p>
				</div>
			</div>

			<div class="boot-screen__blocks mt-5" aria-hidden="true">
				{#each blocks as block (block)}
					<span data-index={block}></span>
				{/each}
			</div>

			<p class="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted">
				<PixelIcon name="check" size={12} class="text-success" />
				initializing curiosity.dll ... ok
			</p>

			<button type="button" onclick={finish} class="pixel-btn pixel-btn--ghost mt-5 w-full">
				skip intro
				<PixelIcon name="arrow" size={14} />
			</button>
		</div>
	</div>
</div>
