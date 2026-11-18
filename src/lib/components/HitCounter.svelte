<script lang="ts">
	import { onMount } from 'svelte';

	let hits = $state<number | null>(null);

	onMount(() => {
		try {
			const next = Number(localStorage.getItem('qila.hits') ?? 0) + 1;
			localStorage.setItem('qila.hits', String(next));
			hits = next;
		} catch {
			hits = null;
		}
	});

	const digits = $derived((hits === null ? '------' : String(hits).padStart(6, '0')).split(''));
</script>

<div class="flex items-center gap-2">
	<span class="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">your visits</span>
	<span
		class="flex gap-0.5"
		aria-label={hits === null ? 'Visit counter' : `${hits} visits from this browser`}
	>
		{#each digits as digit, index (index)}
			<span
				class="grid h-5 w-4 place-items-center border border-line-strong bg-plum font-mono text-[10px] text-cream"
				aria-hidden="true">{digit}</span
			>
		{/each}
	</span>
</div>
