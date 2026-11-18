<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		lines: string[];
		prefix?: string;
		class?: string;
	};

	let { lines, prefix = '', class: className = '' }: Props = $props();

	let text = $state('');
	let caretOn = $state(true);

	onMount(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce || lines.length === 0) {
			text = lines[0] ?? '';
			caretOn = false;
			return;
		}

		let index = 0;
		let position = 0;
		let deleting = false;
		let timer = 0;
		let stopped = false;

		const tick = () => {
			if (stopped) return;
			const line = lines[index];

			if (!deleting) {
				position += 1;
				text = line.slice(0, position);
				caretOn = true;

				if (position >= line.length) {
					deleting = true;
					timer = window.setTimeout(tick, 2100);
					return;
				}
				timer = window.setTimeout(tick, 48 + Math.random() * 46);
				return;
			}

			position -= 1;
			text = line.slice(0, Math.max(0, position));

			if (position <= 0) {
				deleting = false;
				index = (index + 1) % lines.length;
				timer = window.setTimeout(tick, 380);
				return;
			}
			timer = window.setTimeout(tick, 26);
		};

		text = '';
		timer = window.setTimeout(tick, 500);

		const blink = window.setInterval(() => {
			caretOn = !caretOn;
		}, 560);

		return () => {
			stopped = true;
			window.clearTimeout(timer);
			window.clearInterval(blink);
		};
	});
</script>

<span class={className}>
	<span class="sr-only">{lines.join(' · ')}</span>
	<span aria-hidden="true">
		{#if prefix}<span class="text-muted">{prefix}</span>{/if}{text}<span
			class={['caret', { 'caret-off': !caretOn }]}>▌</span
		>
	</span>
</span>

<style>
	.caret {
		display: inline-block;
		margin-left: 1px;
		color: var(--rose-deep);
		transition: opacity 120ms steps(1, end);
	}

	.caret-off {
		opacity: 0;
	}
</style>
