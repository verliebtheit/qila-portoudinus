<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 240 170"
	class={className}
	role="img"
	aria-label="Pixel art of a cute computer with a smiling pink screen, a keyboard, and a little flower"
	shape-rendering="crispEdges"
>
	<!-- desk -->
	<rect x="12" y="140" width="216" height="10" fill="var(--sage)" />
	<rect x="12" y="140" width="216" height="3" fill="var(--cream)" opacity="0.55" />
	<rect x="26" y="150" width="9" height="16" fill="var(--sage)" />
	<rect x="205" y="150" width="9" height="16" fill="var(--sage)" />

	<!-- plant -->
	<g aria-hidden="true">
		<rect x="24" y="122" width="20" height="16" fill="var(--rose)" />
		<rect x="24" y="122" width="20" height="3" fill="var(--cream)" opacity="0.55" />
		<rect x="32" y="112" width="4" height="10" fill="var(--sage)" />
		<rect x="28" y="108" width="4" height="4" fill="var(--sage)" />
		<rect x="36" y="104" width="4" height="4" fill="var(--sage)" />
		<rect x="24" y="100" width="8" height="8" fill="var(--bubblegum)" />
		<rect x="36" y="96" width="8" height="8" fill="var(--bubblegum)" />
		<rect x="32" y="100" width="4" height="4" fill="var(--cream)" />
	</g>

	<!-- monitor -->
	<rect x="48" y="28" width="120" height="86" fill="var(--plum-deep)" />
	<rect x="52" y="32" width="112" height="78" fill="var(--cream)" />
	<rect x="58" y="38" width="100" height="62" fill="var(--plum-deep)" />
	<rect x="62" y="42" width="92" height="54" fill="var(--bubblegum)" />

	<!-- screen face -->
	<g aria-hidden="true">
		<rect x="80" y="56" width="10" height="8" fill="var(--plum-deep)" />
		<rect x="126" y="56" width="10" height="8" fill="var(--plum-deep)" />
		<rect x="96" y="76" width="24" height="5" fill="var(--plum-deep)" />
		<rect x="91" y="71" width="5" height="5" fill="var(--plum-deep)" />
		<rect x="120" y="71" width="5" height="5" fill="var(--plum-deep)" />
		<rect x="70" y="70" width="8" height="4" fill="var(--rose)" />
		<rect x="138" y="70" width="8" height="4" fill="var(--rose)" />
		<rect x="70" y="48" width="4" height="4" fill="var(--cream)" />
		<rect x="142" y="48" width="4" height="4" fill="var(--cream)" />
		<rect x="66" y="86" width="4" height="4" fill="var(--cream)" />
		<rect x="146" y="84" width="4" height="4" fill="var(--cream)" />
	</g>

	<!-- blinking cursor on screen -->
	<rect class="blink" x="74" y="86" width="10" height="4" fill="var(--cream)" aria-hidden="true" />

	<!-- monitor stand -->
	<rect x="96" y="114" width="24" height="10" fill="var(--plum-deep)" />
	<rect x="100" y="114" width="16" height="10" fill="var(--cream)" />
	<rect x="82" y="124" width="52" height="6" fill="var(--plum-deep)" />
	<rect x="86" y="124" width="44" height="4" fill="var(--cream)" />

	<!-- tower -->
	<rect x="178" y="58" width="34" height="72" fill="var(--plum-deep)" />
	<rect x="182" y="62" width="26" height="64" fill="var(--cream)" />
	<rect x="188" y="70" width="14" height="4" fill="var(--rose)" />
	<rect x="188" y="78" width="14" height="3" fill="var(--line)" />
	<rect x="188" y="86" width="7" height="7" fill="var(--sage)" />
	<rect x="199" y="87" width="3" height="3" fill="var(--rose)" />
	<rect x="186" y="112" width="8" height="8" fill="var(--bubblegum)" />
	<rect x="189" y="109" width="2" height="2" fill="var(--bubblegum)" />
	<rect x="189" y="107" width="2" height="2" fill="var(--bubblegum)" />
	<rect x="191" y="109" width="2" height="2" fill="var(--bubblegum)" />

	<!-- keyboard -->
	<rect x="62" y="130" width="94" height="12" fill="var(--plum-deep)" />
	<rect x="65" y="132" width="88" height="8" fill="var(--cream)" />
	<g fill="var(--line)" aria-hidden="true">
		<rect x="69" y="134" width="7" height="2" />
		<rect x="78" y="134" width="7" height="2" />
		<rect x="87" y="134" width="7" height="2" />
		<rect x="96" y="134" width="7" height="2" />
		<rect x="105" y="134" width="7" height="2" />
		<rect x="114" y="134" width="7" height="2" />
		<rect x="123" y="134" width="7" height="2" />
		<rect x="132" y="134" width="7" height="2" />
		<rect x="141" y="134" width="8" height="2" />
		<rect x="69" y="137" width="16" height="2" />
		<rect x="88" y="137" width="48" height="2" />
		<rect x="139" y="137" width="10" height="2" />
	</g>

	<!-- mouse -->
	<rect x="164" y="128" width="11" height="16" fill="var(--plum-deep)" />
	<rect x="167" y="130" width="5" height="7" fill="var(--cream)" />
	<rect x="167" y="139" width="5" height="3" fill="var(--bubblegum)" />

	<!-- mug -->
	<g aria-hidden="true">
		<rect x="178" y="118" width="14" height="18" fill="var(--rose)" />
		<rect x="180" y="120" width="10" height="3" fill="var(--cream)" opacity="0.6" />
		<rect x="192" y="122" width="5" height="3" fill="var(--rose)" />
		<rect x="194" y="125" width="3" height="6" fill="var(--rose)" />
		<rect x="192" y="131" width="5" height="3" fill="var(--rose)" />
		<rect class="float" x="181" y="108" width="3" height="3" fill="var(--cream)" opacity="0.7" />
		<rect
			class="float-alt"
			x="188"
			y="103"
			width="3"
			height="3"
			fill="var(--cream)"
			opacity="0.5"
		/>
	</g>

	<!-- floating hearts + stars -->
	<g class="float" aria-hidden="true">
		<rect x="24" y="40" width="4" height="4" fill="var(--bubblegum)" />
		<rect x="32" y="36" width="4" height="4" fill="var(--rose)" />
		<rect x="20" y="52" width="4" height="4" fill="var(--sage)" />
	</g>

	<g class="float-alt" aria-hidden="true">
		<rect x="206" y="26" width="4" height="4" fill="var(--cream)" />
		<rect x="214" y="20" width="4" height="4" fill="var(--bubblegum)" />
		<rect x="220" y="34" width="4" height="4" fill="var(--sage)" />
	</g>

	<!-- speech bubble -->
	<g aria-hidden="true">
		<rect x="148" y="8" width="58" height="30" fill="var(--plum-deep)" />
		<rect x="151" y="11" width="52" height="24" fill="var(--cream)" />
		<rect x="167" y="38" width="8" height="4" fill="var(--plum-deep)" />
		<rect x="167" y="38" width="4" height="4" fill="var(--cream)" />
		<rect x="166" y="18" width="4" height="4" fill="var(--rose)" />
		<rect x="174" y="18" width="4" height="4" fill="var(--rose)" />
		<rect x="170" y="22" width="4" height="4" fill="var(--rose)" />
		<rect x="166" y="26" width="4" height="4" fill="var(--rose)" />
		<rect x="174" y="26" width="4" height="4" fill="var(--rose)" />
		<rect x="182" y="20" width="12" height="3" fill="var(--sage)" />
		<rect x="182" y="26" width="7" height="3" fill="var(--bubblegum)" />
	</g>
</svg>

<style>
	.float,
	.float-alt {
		animation: scene-float 4.2s ease-in-out infinite;
	}

	.float-alt {
		animation-delay: -2.1s;
	}

	.blink {
		animation: scene-blink 1.15s steps(1, end) infinite;
	}

	@keyframes scene-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	@keyframes scene-blink {
		0%,
		55% {
			opacity: 1;
		}
		56%,
		100% {
			opacity: 0.15;
		}
	}
</style>
