<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	const uid = $props.id();

	type Slot = {
		time: string;
		booked: boolean;
	};

	let slots = $state<Slot[]>([
		{ time: '16:00', booked: false },
		{ time: '17:00', booked: true },
		{ time: '18:00', booked: false }
	]);

	const free = $derived(slots.filter((slot) => !slot.booked).length);

	function toggle(slot: Slot) {
		slot.booked = !slot.booked;
	}
</script>

<div
	class={['scene', className]}
	role="img"
	aria-label="Animated indoor futsal court with moving players and a ball, plus a court booking panel with three selectable time slots"
>
	<div class="topbar" aria-hidden="true">
		<span class="brand">court 01 <span class="dot"></span> indoor</span>
		<span class="status">booking live</span>
	</div>

	<div class="court" aria-hidden="true">
		<svg
			class="markings"
			viewBox="0 0 320 180"
			preserveAspectRatio="none"
			shape-rendering="crispEdges"
		>
			<defs>
				<pattern id={`${uid}-dots`} width="12" height="8" patternUnits="userSpaceOnUse">
					<circle cx="3" cy="3" r="1.2" fill="var(--plum)" />
					<circle cx="9" cy="5" r="1.2" fill="var(--rose)" />
				</pattern>
			</defs>
			<rect x="0" y="1" width="320" height="6" fill={`url(#${uid}-dots)`} opacity="0.6" />
			<rect x="0" y="173" width="320" height="6" fill={`url(#${uid}-dots)`} opacity="0.6" />
			<rect
				x="4"
				y="12"
				width="312"
				height="156"
				fill="none"
				stroke="var(--plum)"
				stroke-width="2"
			/>
			<line x1="160" y1="12" x2="160" y2="168" stroke="var(--plum)" stroke-width="2" />
			<circle cx="160" cy="90" r="24" fill="none" stroke="var(--plum)" stroke-width="2" />
			<circle cx="160" cy="90" r="2.5" fill="var(--plum)" />
			<rect x="4" y="48" width="28" height="84" fill="none" stroke="var(--plum)" stroke-width="2" />
			<rect
				x="288"
				y="48"
				width="28"
				height="84"
				fill="none"
				stroke="var(--plum)"
				stroke-width="2"
			/>
			<path
				d="M32 68a32 32 0 0 1 0 44 M288 68a32 32 0 0 0 0 44"
				fill="none"
				stroke="var(--plum)"
				stroke-width="1.5"
			/>
			<g fill="var(--surface)" stroke="var(--plum)" stroke-width="1.5">
				<rect x="2" y="62" width="10" height="56" />
				<rect x="308" y="62" width="10" height="56" />
			</g>
			<path
				d="M5 62v56 M8 62v56 M2 76h10 M2 90h10 M2 104h10 M311 62v56 M314 62v56 M308 76h10 M308 90h10 M308 104h10"
				stroke="var(--line)"
				stroke-width="1"
			/>
		</svg>

		<div class="banner banner--left">go!</div>
		<div class="banner banner--right">futsal</div>

		<div class="player player--pink">
			<span class="player__token">1</span>
		</div>
		<div class="player player--sage">
			<span class="player__token">2</span>
		</div>
		<div class="ball"></div>
	</div>

	<div class="ticket">
		<div class="ticket__head">
			<span class="ticket__court">reservation / ticket</span>
			<span class="ticket__count">court 01 · {free}/3 free</span>
		</div>
		<div class="slots">
			{#each slots as slot (slot.time)}
				<button
					type="button"
					class={['slot', slot.booked && 'slot--booked']}
					aria-pressed={slot.booked}
					aria-label={`${slot.time} slot, ${slot.booked ? 'booked' : 'available'}. Click to ${slot.booked ? 'release' : 'reserve'}.`}
					title={`${slot.time} · ${slot.booked ? 'booked — click to release' : 'available — click to reserve'}`}
					onclick={(e) => {
						e.stopPropagation();
						toggle(slot);
					}}
				>
					{slot.time}
				</button>
			{/each}
		</div>
		<div class="ticket__foot" aria-hidden="true">
			<span>instant confirm ✓</span>
			<span>no deposit</span>
		</div>
	</div>
</div>

<style>
	.scene {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 5px;
		overflow: hidden;
		padding: 7px;
		background: var(--cream);
		color: var(--ink);
		font-family: var(--font-mono);
	}

	.topbar {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: space-between;
		color: var(--muted);
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.dot {
		width: 5px;
		height: 5px;
		background: var(--rose);
		animation: dot-pulse 2.2s steps(2, end) infinite;
	}

	.status {
		border: 1px solid var(--line-strong);
		background: var(--bubblegum);
		color: var(--plum-deep);
		padding: 1px 4px;
		font-weight: 500;
	}

	.court {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		border: 2px solid var(--line-strong);
		background: color-mix(in srgb, var(--sage) 20%, var(--surface));
	}

	.markings {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.banner {
		position: absolute;
		top: 16px;
		border: 1px solid var(--plum);
		padding: 1px 4px;
		font-family: var(--font-pixel);
		font-size: 8px;
		letter-spacing: 0.1em;
		line-height: 1;
		color: var(--plum-deep);
		text-transform: uppercase;
	}

	.banner--left {
		left: 6px;
		background: var(--bubblegum);
		transform: rotate(-8deg);
	}

	.banner--right {
		right: 6px;
		background: var(--sage);
		transform: rotate(7deg);
	}

	.player {
		position: absolute;
		width: 12px;
		height: 12px;
	}

	.player--pink {
		left: 22%;
		top: 54%;
		animation: pink-patrol 7s ease-in-out infinite;
	}

	.player--sage {
		left: 64%;
		top: 38%;
		animation: sage-patrol 6s ease-in-out infinite;
	}

	.player__token {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border: 2px solid var(--plum-deep);
		font-size: 7px;
		line-height: 1;
		animation: token-bob 1.4s ease-in-out infinite;
	}

	.player--pink .player__token {
		background: var(--bubblegum);
		color: var(--plum-deep);
	}

	.player--sage .player__token {
		background: var(--sage);
		color: var(--plum-deep);
		animation-delay: -0.7s;
	}

	.ball {
		position: absolute;
		left: 42%;
		top: 62%;
		width: 7px;
		height: 7px;
		border: 2px solid var(--plum-deep);
		background: var(--cream);
		animation: ball-dribble 5.5s ease-in-out infinite;
	}

	.ticket {
		display: flex;
		flex: none;
		flex-direction: column;
		gap: 4px;
		border: 2px solid var(--line-strong);
		background: var(--surface);
		box-shadow: 2px 2px 0 0 var(--shadow);
		padding: 5px 6px;
	}

	.ticket__head,
	.ticket__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}

	.ticket__head {
		font-size: 8px;
	}

	.ticket__court {
		color: var(--rose-deep);
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.ticket__count {
		color: var(--ink);
	}

	.slots {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
	}

	.slot {
		border: 2px solid var(--line-strong);
		background: var(--bubblegum);
		color: var(--plum-deep);
		padding: 3px 0;
		font-family: var(--font-mono);
		font-size: 9px;
		line-height: 1;
		transition:
			transform 140ms ease,
			box-shadow 140ms ease,
			background-color 140ms ease;
	}

	.slot:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 0 0 var(--shadow);
		background: var(--rose);
	}

	.slot--booked {
		background: var(--surface-2);
		color: var(--muted);
		text-decoration: line-through;
	}

	.slot--booked:hover {
		background: var(--cream-deep);
	}

	.ticket__foot {
		color: var(--muted);
		font-size: 7px;
		letter-spacing: 0.04em;
	}

	@keyframes dot-pulse {
		0%,
		70% {
			opacity: 1;
		}
		71%,
		100% {
			opacity: 0.3;
		}
	}

	@keyframes token-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	@keyframes pink-patrol {
		0%,
		100% {
			left: 22%;
			top: 54%;
		}
		25% {
			left: 38%;
			top: 40%;
		}
		50% {
			left: 52%;
			top: 60%;
		}
		75% {
			left: 34%;
			top: 66%;
		}
	}

	@keyframes sage-patrol {
		0%,
		100% {
			left: 64%;
			top: 38%;
		}
		33% {
			left: 74%;
			top: 62%;
		}
		66% {
			left: 56%;
			top: 52%;
		}
	}

	@keyframes ball-dribble {
		0%,
		100% {
			left: 42%;
			top: 62%;
		}
		20% {
			left: 48%;
			top: 50%;
		}
		40% {
			left: 56%;
			top: 44%;
		}
		60% {
			left: 50%;
			top: 58%;
		}
		80% {
			left: 44%;
			top: 52%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.player,
		.player__token,
		.ball {
			animation: none;
		}

		.slot {
			transition: none;
		}
	}
</style>
