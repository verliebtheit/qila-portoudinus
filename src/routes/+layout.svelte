<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		// Respect the visitor's motion preference: the browser scrolls natively.
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// `anchors: true` keeps #about / #projects links working with Lenis.
		const lenis = new Lenis({ anchors: true, lerp: 0.1 });

		let frame = requestAnimationFrame(function raf(time) {
			lenis.raf(time);
			frame = requestAnimationFrame(raf);
		});

		return () => {
			cancelAnimationFrame(frame);
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Qila — Student Developer</title>
	<meta property="og:title" content="qila.exe — a little corner of the internet" />
	<meta
		property="og:description"
		content="A student developer learning in public. Pink pixels, small projects, and a lot of curiosity."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

{@render children()}
