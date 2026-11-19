<script lang="ts">
	import FutsalScene from './FutsalScene.svelte';
	import FootballScene from './FootballScene.svelte';
	import SnapsScene from './SnapsScene.svelte';

	type Props = {
		kind?: string;
		class?: string;
	};

	let { kind = 'preview', class: className = '' }: Props = $props();
</script>

{#if kind === 'futsal'}
	<FutsalScene class={className} />
{:else if kind === 'football'}
	<FootballScene class={className} />
{:else if kind === 'snaps'}
	<SnapsScene class={className} />
{:else}
	<div class={['scene', className]} role="img" aria-label={kind + ' project preview'}>
		<span class="chip">{kind}</span>
	</div>
{/if}

<style>
	.scene {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: var(--surface);
	}

	.chip {
		border: 2px solid var(--line-strong);
		background: var(--cream);
		color: var(--muted);
		padding: 0.35rem 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
</style>
