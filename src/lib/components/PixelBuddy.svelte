<script lang="ts">
	import { onMount } from 'svelte';
	import PixelIcon from './PixelIcon.svelte';

	const phrases = [
		"hi! i'm mochi, the site cat.",
		'you found my corner of the internet!',
		'pssst — the projects folder is open.',
		'hydration check. then maybe say hi?',
		'i nap on keyboards. it helps. probably.',
		'thank you for visiting. meow.'
	];

	let index = $state(0);
	let open = $state(false);

	onMount(() => {
		try {
			const next = Number(localStorage.getItem('qila.visits') ?? 0) + 1;
			localStorage.setItem('qila.visits', String(next));
		} catch {
			// localStorage can be unavailable in private mode.
		}
	});

	function speak() {
		open = true;
		index = (index + 1) % phrases.length;
	}
</script>

<aside
	class="pointer-events-none fixed inset-x-0 bottom-3 z-30 hidden justify-end px-4 sm:flex sm:px-6"
	aria-label="Mochi the site cat"
>
	<div class="pointer-events-auto flex items-end gap-2">
		{#if open}
			<div
				id="mochi-speech"
				class="pixel-shadow-sm relative mb-2 max-w-[15rem] border-2 border-line-strong bg-surface px-3 py-2.5"
			>
				<button
					type="button"
					onclick={() => (open = false)}
					class="absolute top-1 right-1 grid size-6 place-items-center border border-line-strong text-muted hover:bg-bubblegum-soft hover:text-ink"
					aria-label="Close Mochi's message"
				>
					<PixelIcon name="close" size={10} />
				</button>
				<p class="pr-5 font-mono text-[11px] leading-relaxed text-ink" aria-live="polite">
					{phrases[index]}
				</p>
				<span
					class="absolute right-7 -bottom-[7px] size-3 rotate-45 border-r-2 border-b-2 border-line-strong bg-surface"
					aria-hidden="true"
				></span>
			</div>
		{/if}

		<button
			type="button"
			onclick={speak}
			aria-expanded={open}
			aria-controls="mochi-speech"
			aria-label="Say hi to Mochi, the site cat"
			title="Say hi to Mochi"
			class="pixel-shadow grid size-14 place-items-center border-2 border-line-strong bg-sage text-plum-deep transition-transform hover:-translate-y-1 hover:bg-bubblegum"
		>
			<PixelIcon name="cat" size={30} class="animate-bob" />
		</button>
	</div>
</aside>
