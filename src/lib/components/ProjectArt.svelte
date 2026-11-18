<script lang="ts">
	type Props = {
		kind?: string;
		class?: string;
	};

	let { kind = 'preview', class: className = '' }: Props = $props();

	const labels: Record<string, string> = {
		futsal: 'Animated pixel futsal court preview',
		football: 'Animated pixel football game preview',
		snaps: 'Animated pixel social app preview'
	};

	const label = $derived(labels[kind] ?? 'Project preview');
</script>

<div class={`scene ${className}`} role="img" aria-label={label}>
	<div class="fallback" aria-hidden="true">
		<span class="fallback__icon">▣</span>
		<span class="fallback__text">{kind}</span>
	</div>
</div>

<style>
	.scene {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: var(--cream, #fce8dc);
	}

	.fallback {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--muted, #75627b);
		font-family: var(--font-mono, monospace);
	}

	.fallback__icon {
		font-size: 2rem;
		line-height: 1;
	}

	.fallback__text {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
