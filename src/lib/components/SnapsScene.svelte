<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	type Tone = 'pink' | 'sage' | 'rose';
	type Message = {
		id: number;
		initials: string;
		text: string;
		tone: Tone;
	};
	type Reaction = {
		id: number;
		glyph: string;
		x: number;
		tone: Tone;
	};

	const incoming: Omit<Message, 'id'>[] = [
		{ initials: 'MO', text: 'brb, feeding the cat', tone: 'pink' },
		{ initials: 'HI', text: 'new photo uploaded ✿', tone: 'sage' },
		{ initials: 'YO', text: 'that song though', tone: 'rose' }
	];

	let messages = $state<Message[]>([
		{ id: 1, initials: 'MO', text: 'brb, feeding the cat', tone: 'pink' },
		{ id: 2, initials: 'HI', text: 'new photo uploaded ✿', tone: 'sage' },
		{ id: 3, initials: 'YO', text: 'that song though', tone: 'rose' }
	]);
	let reactions = $state<Reaction[]>([]);
	let unread = $state(2);

	let nextId = 4;
	let cycle = 0;
	let reduced = false;
	const timers: ReturnType<typeof setTimeout>[] = [];

	function later(fn: () => void, ms: number) {
		const id = setTimeout(() => {
			const index = timers.indexOf(id);
			if (index !== -1) timers.splice(index, 1);
			fn();
		}, ms);
		timers.push(id);
	}

	onMount(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = query.matches;
		let interval: ReturnType<typeof setInterval> | undefined;

		const stop = () => {
			if (interval !== undefined) {
				clearInterval(interval);
				interval = undefined;
			}
		};

		const start = () => {
			if (interval !== undefined || reduced) return;
			interval = setInterval(() => {
				const next = incoming[cycle % incoming.length];
				cycle += 1;
				messages.push({ ...next, id: nextId++ });
				if (messages.length > 4) messages.shift();
				unread += 1;
			}, 4500);
		};

		const onChange = (event: MediaQueryListEvent) => {
			reduced = event.matches;
			if (reduced) stop();
			else start();
		};

		query.addEventListener('change', onChange);
		start();

		return () => {
			query.removeEventListener('change', onChange);
			stop();
			for (const id of timers) clearTimeout(id);
			timers.length = 0;
		};
	});

	function react(glyph: string, tone: Tone, x: number) {
		const id = nextId++;
		reactions.push({ id, glyph, tone, x });
		later(() => {
			reactions = reactions.filter((reaction) => reaction.id !== id);
		}, 1100);
	}
</script>

<div
	class={['scene', className]}
	role="img"
	aria-label="Retro snaps app window with a feed of short message bubbles, an unread badge, and three reaction buttons that send floating hearts, stars, and flowers"
>
	<div class="window">
		<div class="titlebar" aria-hidden="true">
			<span class="dots"><i></i><i></i><i></i></span>
			<span class="title">snaps</span>
			<span class="badge">{unread > 9 ? '9+' : unread}</span>
		</div>

		<!-- Ambient messages are decorative; no aria-live to avoid chatty announcements. -->
		<div class="feed" aria-hidden="true">
			{#each messages as message (message.id)}
				<div class={['row', message.tone === 'sage' && 'row--them']}>
					<span
						class={[
							'avatar',
							message.tone === 'pink' && 'avatar--pink',
							message.tone === 'sage' && 'avatar--sage',
							message.tone === 'rose' && 'avatar--rose'
						]}
					>
						{message.initials}
					</span>
					<span class="bubble">{message.text}</span>
				</div>
			{/each}
		</div>

		<div class="composer" aria-hidden="true">
			<span class="placeholder">say something nice…</span>
			<span class="send">➤</span>
		</div>

		<div class="reactions">
			<span class="reactions__label" aria-hidden="true">send a little something</span>
			<div class="reaction-row">
				<button
					type="button"
					class="reaction"
					aria-label="Send a heart reaction"
					title="heart"
					onclick={(e) => {
						e.stopPropagation();
						react('♥', 'pink', 22);
					}}
				>
					♥
				</button>
				<button
					type="button"
					class="reaction"
					aria-label="Send a star reaction"
					title="star"
					onclick={(e) => {
						e.stopPropagation();
						react('✦', 'sage', 50);
					}}
				>
					✦
				</button>
				<button
					type="button"
					class="reaction"
					aria-label="Send a flower reaction"
					title="flower"
					onclick={(e) => {
						e.stopPropagation();
						react('✿', 'rose', 78);
					}}
				>
					✿
				</button>
			</div>
			<div class="floaters" aria-hidden="true">
				{#each reactions as reaction (reaction.id)}
					<span
						class={[
							'floater',
							reaction.tone === 'pink' && 'floater--pink',
							reaction.tone === 'sage' && 'floater--sage',
							reaction.tone === 'rose' && 'floater--rose'
						]}
						style:--x={`${reaction.x}%`}
					>
						{reaction.glyph}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.scene {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		padding: 7px;
		background: var(--cream-deep);
		font-family: var(--font-mono);
	}

	.window {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;
		max-width: 330px;
		flex-direction: column;
		overflow: hidden;
		border: 2px solid var(--line-strong);
		background: var(--surface);
		box-shadow: 3px 3px 0 0 var(--shadow);
	}

	.titlebar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 6px;
		border-bottom: 2px solid var(--line-strong);
		background: var(--bubblegum);
		color: var(--plum-deep);
		padding: 3px 6px;
	}

	.dots {
		display: inline-flex;
		gap: 3px;
	}

	.dots i {
		width: 5px;
		height: 5px;
		border: 1px solid var(--plum-deep);
		background: var(--cream);
	}

	.title {
		font-family: var(--font-pixel);
		font-size: 12px;
		letter-spacing: 0.06em;
		line-height: 1;
	}

	.badge {
		margin-left: auto;
		border: 1px solid var(--plum-deep);
		background: var(--surface);
		padding: 0 4px;
		font-size: 8px;
		font-weight: 500;
		animation: badge-pulse 4.5s steps(2, end) infinite;
	}

	.feed {
		display: flex;
		flex: 1;
		min-height: 0;
		flex-direction: column;
		gap: 5px;
		overflow: hidden;
		padding: 6px;
	}

	.row {
		display: flex;
		align-items: flex-end;
		gap: 5px;
	}

	.row--them {
		flex-direction: row-reverse;
	}

	.avatar {
		display: grid;
		flex: none;
		place-items: center;
		width: 18px;
		height: 18px;
		border: 2px solid var(--plum-deep);
		color: var(--plum-deep);
		font-size: 7px;
		font-weight: 500;
	}

	.avatar--pink {
		background: var(--bubblegum);
	}

	.avatar--sage {
		background: var(--sage);
	}

	.avatar--rose {
		background: var(--rose);
	}

	.bubble {
		max-width: 78%;
		border: 2px solid var(--line-strong);
		background: var(--surface-2);
		color: var(--ink);
		padding: 3px 5px;
		font-size: 8px;
		line-height: 1.3;
	}

	.row--them .bubble {
		background: color-mix(in srgb, var(--sage) 22%, var(--surface));
	}

	.composer {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		border-top: 1px dashed var(--line);
		color: var(--muted);
		padding: 3px 6px;
		font-size: 8px;
	}

	.placeholder {
		opacity: 0.85;
	}

	.send {
		border: 1px solid var(--line-strong);
		background: var(--surface-2);
		color: var(--plum-deep);
		padding: 0 4px;
	}

	.reactions {
		position: relative;
		display: flex;
		flex: none;
		align-items: center;
		gap: 6px;
		border-top: 2px solid var(--line-strong);
		padding: 4px 6px;
	}

	.reactions__label {
		color: var(--muted);
		font-size: 7px;
		letter-spacing: 0.04em;
	}

	.reaction-row {
		display: inline-flex;
		gap: 4px;
	}

	.reaction {
		width: 22px;
		height: 19px;
		border: 2px solid var(--line-strong);
		background: var(--surface-2);
		color: var(--rose-deep);
		padding: 0;
		font-family: var(--font-pixel);
		font-size: 11px;
		line-height: 1;
		transition:
			transform 140ms ease,
			background-color 140ms ease;
	}

	.reaction:hover {
		transform: translateY(-2px);
		background: var(--bubblegum);
		color: var(--plum-deep);
	}

	.floaters {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.floater {
		position: absolute;
		bottom: 2px;
		left: var(--x);
		font-family: var(--font-pixel);
		font-size: 13px;
		line-height: 1;
		animation: float-up 1.1s ease-out forwards;
	}

	.floater--pink {
		color: var(--rose);
	}

	.floater--sage {
		color: var(--sage);
	}

	.floater--rose {
		color: var(--rose-deep);
	}

	@keyframes badge-pulse {
		0%,
		70% {
			box-shadow: 0 0 0 0 var(--bubblegum);
		}
		71%,
		100% {
			box-shadow: 0 0 0 2px var(--bubblegum);
		}
	}

	@keyframes float-up {
		0% {
			opacity: 0;
			transform: translateY(6px);
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-26px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.badge,
		.floater {
			animation: none;
		}

		.reaction {
			transition: none;
		}
	}
</style>
