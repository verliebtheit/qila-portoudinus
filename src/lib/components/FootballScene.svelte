<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();

	let home = $state(0);
	let away = $state(0);
	let kicking = $state(false);
	let goalFlash = $state(false);

	const timers: ReturnType<typeof setTimeout>[] = [];

	function later(fn: () => void, ms: number) {
		const id = setTimeout(() => {
			const index = timers.indexOf(id);
			if (index !== -1) timers.splice(index, 1);
			fn();
		}, ms);
		timers.push(id);
	}

	function clearTimers() {
		for (const id of timers) clearTimeout(id);
		timers.length = 0;
	}

	onMount(() => {
		return () => clearTimers();
	});

	function kick() {
		if (kicking) return;
		kicking = true;
		later(() => {
			home += 1;
			kicking = false;
			goalFlash = true;
			later(() => {
				goalFlash = false;
			}, 900);
		}, 520);
	}

	function reset() {
		clearTimers();
		home = 0;
		away = 0;
		kicking = false;
		goalFlash = false;
	}

	const confetti = [
		{ x: 16, delay: 0 },
		{ x: 30, delay: 90 },
		{ x: 45, delay: 40 },
		{ x: 60, delay: 140 },
		{ x: 76, delay: 70 }
	];
</script>

<div
	class={['scene', className]}
	role="img"
	aria-label="Arcade-style pixel football game with a live scoreboard, a striped pitch, a ball that flies toward the goal on kick, and kick and reset buttons"
>
	<div class="scoreboard" aria-hidden="true">
		<div class="team">
			<span class="team__name">you</span>
			<strong class="score">{home}</strong>
		</div>
		<div class="middle">
			<span class="clock">01:30</span>
			<span class="colon">:</span>
			<span class="press">press kick</span>
		</div>
		<div class="team team--away">
			<strong class="score">{away}</strong>
			<span class="team__name">cpu</span>
		</div>
		{#if goalFlash}
			<span class="goal-flash">GOAL!</span>
		{/if}
	</div>

	<div class="pitch" aria-hidden="true">
		<div class="stripes"></div>
		<svg
			class="lines"
			viewBox="0 0 320 150"
			preserveAspectRatio="none"
			shape-rendering="crispEdges"
		>
			<rect
				x="4"
				y="4"
				width="312"
				height="142"
				fill="none"
				stroke="var(--cream)"
				stroke-width="2"
			/>
			<line x1="160" y1="4" x2="160" y2="146" stroke="var(--cream)" stroke-width="2" />
			<circle cx="160" cy="75" r="20" fill="none" stroke="var(--cream)" stroke-width="2" />
			<rect
				x="4"
				y="36"
				width="24"
				height="78"
				fill="none"
				stroke="var(--cream)"
				stroke-width="2"
			/>
			<rect
				x="292"
				y="36"
				width="24"
				height="78"
				fill="none"
				stroke="var(--cream)"
				stroke-width="2"
			/>
			<rect x="280" y="48" width="12" height="54" fill="var(--cream)" />
			<path
				d="M283 48v54 M286 48v54 M280 60h12 M280 72h12 M280 84h12 M280 96h12"
				stroke="var(--sage)"
				stroke-width="1"
			/>
		</svg>

		<div class="sprite sprite--you"></div>
		<div class="sprite sprite--cpu"></div>
		<div class={['ball', kicking && 'ball--kick']}></div>

		{#if goalFlash}
			<div class="confetti">
				{#each confetti as bit (bit.x)}
					<span class="bit" style:--x={`${bit.x}%`} style:--delay={`${bit.delay}ms`}></span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="controls">
		<button
			type="button"
			class="kick"
			aria-label="Kick the ball to score a goal"
			title="Kick!"
			disabled={kicking}
			onclick={(e) => {
				e.stopPropagation();
				kick();
			}}
		>
			kick!
		</button>
		<button
			type="button"
			class="reset"
			aria-label="Reset the game score"
			title="Reset score"
			onclick={(e) => {
				e.stopPropagation();
				reset();
			}}
		>
			reset
		</button>
		<span class="hint" aria-hidden="true">⏱ 01:30 · arcade</span>
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
		background: var(--plum);
		font-family: var(--font-mono);
	}

	.scoreboard {
		position: relative;
		display: grid;
		flex: none;
		grid-template-columns: 1fr 1.2fr 1fr;
		align-items: center;
		border: 2px solid var(--bubblegum);
		background: var(--screen);
		color: var(--screen-ink);
		padding: 3px 6px;
	}

	.team {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.team--away {
		justify-content: flex-end;
	}

	.team__name {
		font-size: 8px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.score {
		font-family: var(--font-pixel);
		font-size: 16px;
		line-height: 1;
	}

	.middle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 8px;
	}

	.clock {
		color: var(--bubblegum);
	}

	.colon {
		font-family: var(--font-pixel);
		font-size: 13px;
		line-height: 1;
	}

	.press {
		opacity: 0.7;
		letter-spacing: 0.06em;
	}

	.goal-flash {
		position: absolute;
		right: 4px;
		bottom: -9px;
		border: 1px solid var(--plum-deep);
		background: var(--bubblegum);
		color: var(--plum-deep);
		padding: 1px 5px;
		font-family: var(--font-pixel);
		font-size: 11px;
		line-height: 1.1;
		transform: rotate(-5deg);
		animation: score-pop 900ms steps(2, end) both;
	}

	.pitch {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		border: 2px solid var(--plum-deep);
		background: color-mix(in srgb, var(--sage) 55%, var(--cream-deep));
	}

	.stripes {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			90deg,
			color-mix(in srgb, var(--sage) 62%, var(--cream)) 0 16px,
			color-mix(in srgb, var(--sage) 42%, var(--cream)) 16px 32px
		);
		opacity: 0.7;
	}

	.lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.sprite {
		position: absolute;
		width: 12px;
		height: 18px;
		border: 2px solid var(--plum-deep);
		animation: sprite-bob 1.7s ease-in-out infinite;
	}

	.sprite::before {
		content: '';
		position: absolute;
		top: -9px;
		left: 2px;
		width: 8px;
		height: 8px;
		border: 2px solid var(--plum-deep);
		background: var(--cream);
	}

	.sprite::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: -2px;
		width: 5px;
		height: 4px;
		background: var(--plum-deep);
		box-shadow: 8px 0 0 0 var(--plum-deep);
	}

	.sprite--you {
		left: 26%;
		top: 56%;
		background: var(--bubblegum);
	}

	.sprite--cpu {
		left: 70%;
		top: 32%;
		background: var(--cream);
		animation-delay: -0.8s;
	}

	.ball {
		position: absolute;
		left: 32%;
		top: 58%;
		width: 8px;
		height: 8px;
		border: 2px solid var(--plum-deep);
		background: var(--cream);
		animation: ball-hover 2.2s ease-in-out infinite;
	}

	.ball--kick {
		animation: ball-shot 520ms cubic-bezier(0.35, 0, 0.85, 0.45) forwards;
	}

	.confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.bit {
		position: absolute;
		bottom: 0;
		left: var(--x);
		width: 5px;
		height: 5px;
		background: var(--sage);
		animation: confetti-rise 900ms steps(7, end) var(--delay) both;
	}

	.bit:nth-child(even) {
		background: var(--bubblegum);
	}

	.controls {
		display: flex;
		flex: none;
		align-items: center;
		gap: 5px;
	}

	.kick,
	.reset {
		border: 2px solid var(--plum-deep);
		font-family: var(--font-mono);
		font-size: 9px;
		line-height: 1;
		padding: 4px 8px;
		transition:
			transform 130ms ease,
			box-shadow 130ms ease;
	}

	.kick {
		background: var(--bubblegum);
		color: var(--plum-deep);
		box-shadow: 2px 2px 0 0 var(--plum-deep);
	}

	.kick:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 3px 4px 0 0 var(--plum-deep);
	}

	.kick:disabled {
		cursor: wait;
		opacity: 0.65;
	}

	.reset {
		background: var(--screen);
		color: var(--screen-ink);
	}

	.reset:hover {
		transform: translateY(-2px);
	}

	.hint {
		margin-left: auto;
		color: var(--cream);
		font-size: 8px;
		letter-spacing: 0.04em;
		opacity: 0.75;
	}

	@keyframes sprite-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	@keyframes ball-hover {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	@keyframes ball-shot {
		0% {
			left: 32%;
			top: 58%;
		}
		70% {
			left: 84%;
			top: 38%;
		}
		100% {
			left: 88%;
			top: 36%;
		}
	}

	@keyframes score-pop {
		0% {
			opacity: 0;
			transform: rotate(-5deg) scale(0.6);
		}
		35% {
			opacity: 1;
			transform: rotate(-5deg) scale(1.15);
		}
		100% {
			opacity: 1;
			transform: rotate(-5deg) scale(1);
		}
	}

	@keyframes confetti-rise {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(-70px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sprite,
		.ball,
		.goal-flash,
		.bit {
			animation: none;
		}

		.kick,
		.reset {
			transition: none;
		}
	}
</style>
