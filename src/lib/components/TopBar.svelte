<script lang="ts">
	import { onMount } from 'svelte';
	import { navItems } from '$lib/data';
	import PixelIcon from './PixelIcon.svelte';

	type Props = {
		active?: string;
	};

	let { active = 'home' }: Props = $props();

	const menuItems = navItems.filter((item) => item.href !== '#home');

	let menuOpen = $state(false);
	let dark = $state(false);
	let time = $state('');
	let progress = $state(0);

	onMount(() => {
		dark = document.documentElement.classList.contains('dark');

		const updateClock = () => {
			time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
				new Date()
			);
		};
		updateClock();
		const clock = window.setInterval(updateClock, 30_000);

		const desktop = matchMedia('(min-width: 768px)');
		const closeOnDesktop = () => {
			if (desktop.matches) menuOpen = false;
		};
		desktop.addEventListener('change', closeOnDesktop);

		let frame = 0;
		const updateProgress = () => {
			frame = 0;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
		};
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(updateProgress);
		};
		updateProgress();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		return () => {
			window.clearInterval(clock);
			desktop.removeEventListener('change', closeOnDesktop);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('qila.theme', dark ? 'dark' : 'light');
		} catch {
			/* ignore */
		}
	}

	function closeMenu() {
		menuOpen = false;
	}

	function idFromHref(href: string) {
		return href.replace('#', '');
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
	}}
	onpointerdown={(event) => {
		if (!menuOpen) return;
		const target = event.target as Element | null;
		if (!target?.closest('header')) closeMenu();
	}}
/>

<header class="sticky top-0 z-40 border-b-2 border-line-strong bg-surface">
	<div class="hidden border-b border-line sm:block">
		<div
			class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase lg:px-6"
		>
			<span>C:\qila\welcome</span>
			<span class="flex items-center gap-2">
				<span class="status-dot" aria-hidden="true"></span>
				online — learning in public
			</span>
		</div>
	</div>

	<div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 lg:px-6">
		<a
			href="#home"
			onclick={closeMenu}
			class="group flex shrink-0 items-center gap-2 font-pixel text-xl leading-none text-ink"
			aria-label="qila.exe — back to top"
		>
			<span
				class="grid size-8 place-items-center border-2 border-line-strong bg-primary text-plum-deep"
				aria-hidden="true"
			>
				<PixelIcon name="star" size={16} />
			</span>
			<span>qila.exe</span>
		</a>

		<nav class="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
			{#each menuItems as item (item.href)}
				{@const id = idFromHref(item.href)}
				<a
					href={item.href}
					aria-current={active === id ? 'page' : undefined}
					class="group relative px-2.5 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-ink {active ===
					id
						? 'text-ink'
						: 'text-muted'}"
				>
					<span
						class="absolute inset-x-2 bottom-1 h-[3px] origin-left bg-primary-strong transition-transform duration-300 group-hover:scale-x-100 {active ===
						id
							? 'scale-x-100'
							: 'scale-x-0'}"
						aria-hidden="true"
					></span>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-2 md:ml-3">
			<span class="mr-1 hidden items-center gap-1.5 font-mono text-[11px] text-muted sm:flex">
				<PixelIcon name="clock" size={14} />
				{time || '--:--'}
			</span>

			<button
				type="button"
				onclick={toggleTheme}
				aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-pressed={dark}
				title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
				class="grid size-10 place-items-center border-2 border-line-strong bg-surface text-ink transition-transform hover:-translate-y-0.5 hover:bg-primary"
			>
				<PixelIcon name={dark ? 'sun' : 'moon'} size={18} />
			</button>

			<button
				type="button"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
				class="grid size-10 place-items-center border-2 border-line-strong bg-surface text-ink transition-transform hover:-translate-y-0.5 hover:bg-primary md:hidden"
			>
				<PixelIcon name={menuOpen ? 'close' : 'menu'} size={18} />
			</button>
		</div>
	</div>

	<div
		class="absolute bottom-0 left-0 h-[3px] bg-rose transition-[width] duration-150 ease-out"
		style="width: {progress}%"
		aria-hidden="true"
	></div>

	{#if menuOpen}
		<div
			id="mobile-menu"
			class="absolute inset-x-0 top-full border-b-2 border-line-strong bg-surface md:hidden"
		>
			<nav class="mx-auto max-w-6xl px-4 pb-4" aria-label="Mobile">
				{#each navItems as item (item.href)}
					{@const id = idFromHref(item.href)}
					<a
						href={item.href}
						onclick={closeMenu}
						aria-current={active === id ? 'page' : undefined}
						class="flex items-center gap-3 border-b border-dotted border-line py-3.5 font-pixel text-lg text-ink {active ===
						id
							? 'text-rose-deep'
							: ''}"
					>
						<PixelIcon name={item.icon} size={20} class="text-rose-deep" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
