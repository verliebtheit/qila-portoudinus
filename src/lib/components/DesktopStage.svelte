<script lang="ts">
	import { onMount } from 'svelte';
	import { about, contact, navItems, projects, site, skillGroups } from '$lib/data';
	import type { IconName } from '$lib/icons';
	import PixelIcon from './PixelIcon.svelte';
	import DraggableSticker from './DraggableSticker.svelte';
	import DesktopWindow from './DesktopWindow.svelte';

	type Geometry = { x: number; y: number; width: number; height: number };
	type WindowState = Geometry & {
		id: string;
		title: string;
		icon: IconName;
		z: number;
		minimized: boolean;
		maximized: boolean;
		closed: boolean;
		blurb?: string;
		href?: string;
		kind?: 'window' | 'note';
		prevGeometry?: Geometry;
	};
	type Toast = { id: number; message: string };

	let { onNotify }: { onNotify?: (message: string) => void } = $props();

	const FALLBACK_W = 960;
	const FALLBACK_H = 680;
	const TASKBAR_H = 58;

	const WINDOW_DEFS: {
		id: string;
		title: string;
		icon: IconName;
		kind: 'window' | 'note';
		blurb?: string;
		href?: string;
	}[] = [
		{ id: 'welcome', title: site.welcome, icon: 'monitor', kind: 'window' },
		{ id: 'notes', title: 'desktop_notes.txt', icon: 'star', kind: 'note' },
		{
			id: 'about',
			title: 'profile.exe',
			icon: 'user',
			kind: 'window',
			blurb: about.intro,
			href: '#about'
		},
		{
			id: 'projects',
			title: 'my_projects/',
			icon: 'folder',
			kind: 'window',
			blurb: `A few things I've worked on while learning: ${projects.map((p) => p.title).join(', ')}.`,
			href: '#projects'
		},
		{
			id: 'skills',
			title: 'skills.exe',
			icon: 'star',
			kind: 'window',
			blurb: `Currently learning ${skillGroups[0].items.join(', ')} — more on the skills shelf.`,
			href: '#skills'
		},
		{
			id: 'contact',
			title: 'contact.exe',
			icon: 'mail',
			kind: 'window',
			blurb: contact.invite,
			href: '#contact'
		},
		{
			id: 'readme',
			title: 'readme.txt',
			icon: 'disk',
			kind: 'note',
			blurb:
				'you found the readme — thanks for poking around. the projects folder is down the page ↓',
			href: '#projects'
		},
		{
			id: 'error',
			title: 'error_404.exe',
			icon: 'disk',
			kind: 'window'
		}
	];

	const STICKERS = [
		{
			icon: 'heart',
			label: 'draggable heart sticker',
			tone: 'text-rose-deep',
			bump: 'careful, it bites :3'
		},
		{
			icon: 'star',
			label: 'draggable star sticker',
			tone: 'text-rose-deep',
			bump: '* sparkle sound *'
		},
		{
			icon: 'flower',
			label: 'draggable flower sticker',
			tone: 'text-sage',
			bump: 'flower power ✿'
		},
		{ icon: 'cat', label: 'draggable cat sticker', tone: 'text-plum-deep', bump: 'meow! *purrrr*' }
	] satisfies { icon: IconName; label: string; tone: string; bump: string }[];

	const desktopIcons: { id: string; label: string; icon: IconName; hidden?: boolean }[] = [
		...navItems
			.filter((item) => item.href !== '#home')
			.map((item) => ({ id: item.href.slice(1), label: item.label, icon: item.icon })),
		{ id: 'readme', label: 'readme', icon: 'disk' },
		{ id: 'error', label: '???', icon: 'disk', hidden: true }
	];

	let windows = $state<WindowState[]>(makeWindows(FALLBACK_W, FALLBACK_H));
	let stickerPos = $state(initialStickerPos(FALLBACK_W, FALLBACK_H));
	let surfaceW = $state(FALLBACK_W);
	let surfaceH = $state(FALLBACK_H);
	let topZ = 12;
	let toasts = $state<Toast[]>([]);
	let toastId = 0;
	const toastTimers: ReturnType<typeof setTimeout>[] = [];
	let startOpen = $state(false);
	let clock = $state('--:--');
	let curiosity = $state(42);
	let layoutReady = false;
	let measuredW = false;
	let measuredH = false;
	let userMoved = false;

	const visibleWindows = $derived(
		windows.filter((win) => !win.closed && !win.minimized).sort((a, b) => a.z - b.z)
	);
	const taskbarWindows = $derived(windows.filter((win) => !win.closed));
	const activeId = $derived(visibleWindows.at(-1)?.id ?? null);

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), Math.max(min, max));
	}

	function geometryFor(id: string, w: number, h: number, index: number): Geometry {
		const mobile = w < 640;

		if (id === 'welcome') {
			return mobile
				? { x: 10, y: 12, width: Math.max(260, w - 20), height: 360 }
				: { x: 104, y: 24, width: Math.min(520, w - 136), height: 400 };
		}

		if (id === 'notes') {
			return mobile
				? { x: 18, y: 56, width: Math.max(250, w - 36), height: 350 }
				: {
						x: Math.max(104, Math.min(360, w - 400)),
						y: 96,
						width: Math.min(420, w - 180),
						height: 372
					};
		}

		if (id === 'error') {
			return mobile
				? { x: 12, y: 70, width: Math.max(250, w - 24), height: 330 }
				: { x: Math.max(104, Math.floor(w / 2) - 190), y: 110, width: 380, height: 320 };
		}

		const row = Math.floor(index / 2);
		return {
			x: mobile ? 14 : 104 + (index % 2) * 36 + row * 16,
			y: mobile ? 48 + (index % 3) * 28 : 84 + row * 34,
			width: mobile ? Math.max(260, w - 28) : Math.min(440, Math.max(280, w - 150)),
			height: mobile ? 340 : 330
		};
	}

	function makeWindows(w: number, h: number): WindowState[] {
		const mobile = w < 640;
		return WINDOW_DEFS.map((def, index) => ({
			...geometryFor(def.id, w, h, index),
			id: def.id,
			title: def.title,
			icon: def.icon,
			blurb: def.blurb,
			href: def.href,
			kind: def.kind,
			z: def.id === 'notes' ? (mobile ? 10 : 12) : 11,
			minimized: mobile && def.id === 'notes',
			maximized: false,
			closed: def.id !== 'welcome' && def.id !== 'notes'
		}));
	}

	function initialStickerPos(w: number, h: number): { x: number; y: number }[] {
		return [
			{ x: Math.max(140, w - 84), y: 36 },
			{ x: Math.max(160, w - 160), y: Math.max(130, Math.floor(h * 0.35)) },
			{ x: Math.max(140, w - 88), y: Math.max(240, Math.floor(h * 0.62)) },
			{ x: Math.max(170, w - 150), y: Math.max(320, h - 110) }
		];
	}

	function applyInitialLayout(w: number, h: number) {
		if (userMoved) return;
		for (const win of windows) {
			if (win.maximized) continue;
			const g = geometryFor(
				win.id,
				w,
				h,
				WINDOW_DEFS.findIndex((def) => def.id === win.id)
			);
			win.x = clamp(g.x, 8, w - 90);
			win.y = clamp(g.y, 8, h - 64);
			win.width = Math.min(g.width, w - 16);
			win.height = Math.min(g.height, h - TASKBAR_H - 12);
		}
		stickerPos = initialStickerPos(w, h);
	}

	function clampAll(w: number, h: number) {
		for (const win of windows) {
			if (win.maximized) continue;
			win.x = clamp(win.x, 8, w - 90);
			win.y = clamp(win.y, 8, h - 64);
			win.width = Math.min(win.width, w - 16);
			win.height = Math.min(win.height, h - TASKBAR_H - 12);
		}
		stickerPos = stickerPos.map((p) => ({
			x: clamp(p.x, 4, w - 44),
			y: clamp(p.y, 4, h - TASKBAR_H - 16)
		}));
	}

	function setSurfaceW(value: number) {
		surfaceW = value || FALLBACK_W;
		measuredW = value > 0;
		maybeLayout();
	}

	function setSurfaceH(value: number) {
		surfaceH = value || FALLBACK_H;
		measuredH = value > 0;
		maybeLayout();
	}

	/** Keep the desktop tidy when it is first measured, then only clamp later resizes. */
	function maybeLayout() {
		if (!measuredW || !measuredH || surfaceW <= 0 || surfaceH <= 0) return;
		if (!layoutReady) {
			layoutReady = true;
			if (!userMoved) applyInitialLayout(surfaceW, surfaceH);
		} else {
			clampAll(surfaceW, surfaceH);
		}
	}

	onMount(() => {
		const tickClock = () => {
			clock = new Intl.DateTimeFormat(undefined, {
				hour: '2-digit',
				minute: '2-digit'
			}).format(new Date());
		};
		tickClock();
		const clockTimer = setInterval(tickClock, 30_000);

		return () => {
			clearInterval(clockTimer);
			for (const timer of toastTimers) clearTimeout(timer);
			toastTimers.length = 0;
		};
	});

	function pushToast(message: string) {
		const id = ++toastId;
		toasts = [...toasts, { id, message }];
		onNotify?.(message);

		const timer = setTimeout(() => {
			toasts = toasts.filter((toast) => toast.id !== id);
			const index = toastTimers.indexOf(timer);
			if (index !== -1) toastTimers.splice(index, 1);
		}, 3200);
		toastTimers.push(timer);
	}

	function findWindow(id: string): WindowState | undefined {
		return windows.find((win) => win.id === id);
	}

	function focusWindow(id: string) {
		const win = findWindow(id);
		if (!win) return;
		win.minimized = false;
		win.z = ++topZ;
	}

	function moveWindow(id: string, x: number, y: number) {
		const win = findWindow(id);
		if (!win) return;
		win.x = clamp(x, 8, surfaceW - 90);
		win.y = clamp(y, 8, surfaceH - 64);
		userMoved = true;
	}

	function minimizeWindow(id: string) {
		const win = findWindow(id);
		if (win) win.minimized = true;
	}

	function toggleMaximize(id: string) {
		const win = findWindow(id);
		if (!win) return;

		if (win.maximized) {
			if (win.prevGeometry) {
				win.x = win.prevGeometry.x;
				win.y = win.prevGeometry.y;
				win.width = win.prevGeometry.width;
				win.height = win.prevGeometry.height;
			}
			win.prevGeometry = undefined;
			win.maximized = false;
		} else {
			win.prevGeometry = {
				x: win.x,
				y: win.y,
				width: win.width,
				height: win.height
			};
			win.x = 12;
			win.y = 12;
			win.width = Math.max(240, surfaceW - 24);
			win.height = Math.max(220, surfaceH - 24 - TASKBAR_H);
			win.maximized = true;
		}
		win.z = ++topZ;
		userMoved = true;
	}

	function closeWindow(id: string) {
		const win = findWindow(id);
		if (win) win.closed = true;
	}

	function openWindow(id: string) {
		const win = findWindow(id);
		if (!win) return;
		win.closed = false;
		win.minimized = false;
		win.z = ++topZ;
	}

	function activateFromIcon(id: string) {
		if (id === 'error') {
			openWindow('error');
			pushToast('⚠ warning: unexpected snack break detected!');
			return;
		}
		openWindow(id);
	}

	function toggleTaskbarWindow(id: string) {
		const win = findWindow(id);
		if (!win) return;
		if (win.minimized) {
			win.minimized = false;
			win.z = ++topZ;
		} else if (activeId === id) {
			win.minimized = true;
		} else {
			win.z = ++topZ;
		}
	}

	function moveSticker(index: number, x: number, y: number) {
		stickerPos[index] = {
			x: clamp(x, 4, surfaceW - 44),
			y: clamp(y, 4, surfaceH - TASKBAR_H - 16)
		};
	}

	function releaseSticker(index: number, x: number, y: number) {
		moveSticker(index, x, y);
	}

	function boostCuriosity() {
		curiosity = curiosity >= 96 ? 42 : Math.min(99, curiosity + 9);
	}

	function resetDesktop() {
		for (const timer of toastTimers) clearTimeout(timer);
		toastTimers.length = 0;
		toasts = [];
		windows = makeWindows(surfaceW, surfaceH);
		stickerPos = initialStickerPos(surfaceW, surfaceH);
		topZ = 12;
		curiosity = 42;
		userMoved = false;
		startOpen = false;
	}
</script>

<section class="desktop-shell" aria-label="Qila's interactive desktop">
	<div
		class="desktop-monitor-bar flex items-center justify-between border-b-2 border-line-strong bg-cream px-3 py-1.5 font-mono text-xs text-muted"
	>
		<span class="inline-flex items-center gap-1.5 font-pixel text-sm text-ink">
			<PixelIcon name="monitor" size={14} class="text-rose-deep" />
			<span>qila.exe — interactive desktop</span>
			<span
				class="hidden border border-line-strong bg-pink px-1 text-[9px] font-bold text-plum-deep sm:inline"
				>Y2K</span
			>
		</span>
		<div class="flex items-center gap-3">
			<span class="hidden text-[11px] md:inline">drag titlebars & stickers</span>
			<button
				type="button"
				onclick={resetDesktop}
				class="font-pixel text-[11px] text-rose-deep underline decoration-dotted hover:text-ink"
				title="Reset all window and sticker positions"
			>
				reset desktop ↺
			</button>
		</div>
	</div>
	<div
		class="desktop-surface"
		bind:clientWidth={null, setSurfaceW}
		bind:clientHeight={null, setSurfaceH}
	>
		<div class="desktop-icons" role="group" aria-label="Desktop shortcuts">
			{#each desktopIcons as item (item.id)}
				<button
					type="button"
					class={['desktop-icon', { 'is-hidden': item.hidden }]}
					aria-label={item.hidden ? 'Mystery disk — surprise me' : `Open ${item.label}`}
					title={item.hidden ? 'do not press (definitely)' : item.label}
					onclick={() => activateFromIcon(item.id)}
				>
					<span class="desktop-icon__art" aria-hidden="true">
						<PixelIcon name={item.icon} size={22} />
					</span>
					<span class="desktop-icon__label">{item.label}</span>
				</button>
			{/each}
		</div>

		<div class="sticker-layer">
			{#each STICKERS as sticker, index (sticker.label)}
				<DraggableSticker
					icon={sticker.icon}
					label={sticker.label}
					x={stickerPos[index].x}
					y={stickerPos[index].y}
					size={index === 1 ? 30 : 34}
					tone={sticker.tone}
					onMove={(x, y) => moveSticker(index, x, y)}
					onRelease={(x, y) => releaseSticker(index, x, y)}
					onBump={() => pushToast(sticker.bump)}
				/>
			{/each}
		</div>

		{#each visibleWindows as win (win.id)}
			<DesktopWindow
				id={win.id}
				title={win.title}
				icon={win.icon}
				x={win.x}
				y={win.y}
				width={win.width}
				height={win.height}
				z={win.z}
				maximized={win.maximized}
				active={activeId === win.id}
				onFocus={focusWindow}
				onMove={moveWindow}
				onMinimize={minimizeWindow}
				onMaximize={toggleMaximize}
				onClose={closeWindow}
			>
				{#if win.id === 'welcome'}
					<div class="window-stack">
						<div class="flex flex-wrap items-center gap-2">
							<span
								class="inline-flex items-center gap-2 border-2 border-line-strong bg-sage px-2 py-1 font-mono text-[10px] text-plum-deep"
							>
								<span class="status-dot" aria-hidden="true"></span>
								{site.status}
							</span>
							<span
								class="border-2 border-dashed border-line-soft bg-cream px-2 py-1 font-mono text-[10px] text-muted"
							>
								role: {site.role}
							</span>
						</div>

						<p class="font-mono text-[11px] text-muted">
							<span class="text-rose-deep">qila@desktop</span>:~$ hello
						</p>

						<h1 class="font-pixel text-4xl leading-none text-ink sm:text-5xl">
							{site.greeting}
						</h1>
						<p class="text-sm leading-relaxed text-muted">{site.intro}</p>

						<div class="flex flex-wrap gap-2">
							<a href="#projects" class="pixel-btn pixel-btn--primary !min-h-10 !text-base">
								open my projects
								<span aria-hidden="true">↗</span>
							</a>
							<a href="#contact" class="pixel-btn !min-h-10 !text-base">
								say hello
								<PixelIcon name="mail" size={14} />
							</a>
						</div>

						<div class="border-2 border-line-strong bg-cream p-2.5">
							<div
								class="mb-1.5 flex items-center justify-between gap-2 font-mono text-[10px] text-muted"
							>
								<span>boosting curiosity…</span>
								<span>{curiosity}%</span>
							</div>
							<div class="h-4 border-2 border-line-strong bg-surface p-0.5" aria-hidden="true">
								<div
									class="h-full bg-[repeating-linear-gradient(90deg,var(--rose)_0_12px,var(--bubblegum)_12px_24px)] transition-[width] duration-300"
									style:width={`${curiosity}%`}
								></div>
							</div>
							<button
								type="button"
								class="mt-2 font-mono text-[11px] text-muted underline decoration-dotted underline-offset-4 hover:text-ink"
								onclick={boostCuriosity}
							>
								click to boost curiosity ✦
							</button>
						</div>
					</div>
				{:else if win.id === 'notes'}
					<div class="window-stack">
						<p class="font-mono text-[10px] tracking-wide text-muted">desktop_notes.txt</p>

						<div class="retro-dots border-2 border-dashed border-line-soft bg-cream p-3">
							<p class="font-pixel text-2xl text-ink">{site.name}</p>
							<p class="font-mono text-[10px] text-muted">aka {site.brand} · {site.role}</p>

							<div class="mt-3 grid grid-cols-3 gap-2 text-center">
								<div class="border-2 border-line-strong bg-pink p-2 text-plum-deep">
									<PixelIcon name="heart" size={16} class="mx-auto block" />
									<span class="mt-1 block font-mono text-[10px]">cute</span>
								</div>
								<div class="border-2 border-line-strong bg-sage p-2 text-plum-deep">
									<PixelIcon name="flower" size={16} class="mx-auto block" />
									<span class="mt-1 block font-mono text-[10px]">cozy</span>
								</div>
								<div class="border-2 border-line-strong bg-surface p-2 text-rose-deep">
									<PixelIcon name="star" size={16} class="mx-auto block" />
									<span class="mt-1 block font-mono text-[10px] text-ink">curious</span>
								</div>
							</div>
						</div>

						<div>
							<p class="font-pixel text-lg text-ink">a few things i love</p>
							<ul class="mt-2 flex flex-wrap gap-1.5">
								{#each site.interests as interest (interest.label)}
									<li
										class="inline-flex items-center gap-1 border-2 border-line-strong bg-cream px-2 py-1 font-mono text-[10px] text-ink"
									>
										<span class="text-rose-deep" aria-hidden="true">
											<PixelIcon name={interest.icon} size={12} />
										</span>
										{interest.label}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{:else if win.id === 'about'}
					<div class="window-stack">
						<div
							class="flex items-center justify-between border-b-2 border-dotted border-line-soft pb-1.5 font-mono text-[10px] text-muted"
						>
							<span>file: profile.exe</span>
							<span>student_developer.bin</span>
						</div>
						<div class="flex items-center gap-3">
							<div
								class="size-16 shrink-0 overflow-hidden border-2 border-line-strong bg-cream shadow-[2px_2px_0_0_var(--shadow)]"
							>
								<img src={about.photo} alt="Qila" class="size-full object-cover" />
							</div>
							<p class="text-xs leading-relaxed text-ink">{about.intro}</p>
						</div>
						<div class="border-2 border-line-strong bg-cream p-2.5">
							<p class="font-pixel text-base text-ink">hobbies & interests</p>
							<div class="mt-2 flex flex-wrap gap-1">
								{#each site.interests as item (item.label)}
									<span
										class="inline-flex items-center gap-1 border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink"
									>
										<span class="text-rose-deep" aria-hidden="true"
											><PixelIcon name={item.icon} size={11} /></span
										>
										{item.label}
									</span>
								{/each}
							</div>
						</div>
						<a href="#about" class="pixel-btn pixel-btn--ghost !min-h-9 justify-center !text-sm">
							view full profile section ↓
						</a>
					</div>
				{:else if win.id === 'projects'}
					<div class="window-stack">
						<div
							class="flex items-center justify-between border-b-2 border-dotted border-line-soft pb-1.5 font-mono text-[10px] text-muted"
						>
							<span>folder: my_projects/</span>
							<span>{projects.length} animated scenes</span>
						</div>
						<div class="grid gap-1.5">
							{#each projects as project (project.title)}
								<div
									class="flex items-center justify-between border-2 border-line-strong bg-cream p-2 font-mono text-xs"
								>
									<div class="flex items-center gap-2">
										<span class="font-pixel text-base text-rose-deep">▣</span>
										<div>
											<p class="leading-tight font-bold text-ink">{project.title}</p>
											<p class="text-[10px] text-muted">{project.description}</p>
										</div>
									</div>
									<span
										class="border border-line-strong bg-pink px-1.5 py-0.5 font-mono text-[9px] font-bold text-plum-deep uppercase"
									>
										{project.label}
									</span>
								</div>
							{/each}
						</div>
						<p class="font-mono text-[11px] text-muted">
							Each project has its own animated mini-scene below!
						</p>
						<a
							href="#projects"
							class="pixel-btn pixel-btn--primary !min-h-9 justify-center !text-sm"
						>
							explore animated mini-scenes ↓
						</a>
					</div>
				{:else if win.id === 'skills'}
					<div class="window-stack">
						<div
							class="flex items-center justify-between border-b-2 border-dotted border-line-soft pb-1.5 font-mono text-[10px] text-muted"
						>
							<span>registry: skills.exe</span>
							<span class="font-semibold text-success">● honest progress</span>
						</div>
						<div class="space-y-2">
							{#each skillGroups as group (group.title)}
								<div class="border-2 border-line-strong bg-cream p-2">
									<p class="font-pixel text-sm text-ink">{group.title}</p>
									<div class="mt-1 flex flex-wrap gap-1">
										{#each group.items as item (item)}
											<span
												class="border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink"
											>
												{item}
											</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
						<a href="#skills" class="pixel-btn pixel-btn--ghost !min-h-9 justify-center !text-sm">
							view skills shelf ↓
						</a>
					</div>
				{:else if win.id === 'contact'}
					<div class="window-stack">
						<div
							class="flex items-center justify-between border-b-2 border-dotted border-line-soft pb-1.5 font-mono text-[10px] text-muted"
						>
							<span>comm: contact.exe</span>
							<span class="font-semibold text-success">● inbox ready</span>
						</div>
						<p class="text-xs leading-relaxed text-ink">{contact.invite}</p>
						<div class="space-y-1.5 border-2 border-line-strong bg-cream p-2 font-mono text-[11px]">
							{#if contact.github}
								<a
									href={contact.github}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
								>
									<PixelIcon name="github" size={12} />
									<span>github: <strong>verliebtheit</strong></span>
								</a>
							{/if}
							{#if contact.email}
								<a
									href="mailto:{contact.email}"
									class="flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
								>
									<PixelIcon name="mail" size={12} />
									<span>email: <strong>{contact.email}</strong></span>
								</a>
							{/if}
							{#if contact.instagram}
								<a
									href={contact.instagram}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
								>
									<PixelIcon name="instagram" size={12} />
									<span>ig: <strong>@lasseraphic</strong></span>
								</a>
							{/if}
						</div>
						<a
							href="#contact"
							class="pixel-btn pixel-btn--primary !min-h-9 justify-center !text-sm"
						>
							open send_message.exe ↓
						</a>
					</div>
				{:else if win.id === 'readme'}
					<div class="window-stack">
						<div
							class="flex items-center justify-between border-b-2 border-line-soft pb-1.5 font-mono text-[10px] text-muted"
						>
							<span>notepad: readme.txt</span>
							<span>v2026.04-y2k</span>
						</div>
						<pre
							class="overflow-x-auto border-2 border-line-strong bg-surface p-2 font-mono text-[11px] leading-snug whitespace-pre text-ink">{`  /\\_/\\  
 ( o.o )  welcome to qila.exe!
  > ^ <   student developer desktop
--------------------------------------
* DRAG windows by their titlebars
* MINIMIZE / MAXIMIZE using corner buttons
* DRAG pixel stickers (they bounce!)
* PLAY with animated mini-scenes below
* SAY HI to Mochi the cat in the corner
--------------------------------------
thanks for visiting my retro space! ✿`}</pre>
						<a href="#about" class="pixel-btn pixel-btn--ghost !min-h-9 justify-center !text-sm">
							learn more about qila ↗
						</a>
					</div>
				{:else if win.id === 'error'}
					<div class="window-stack text-center">
						<div class="flex items-center justify-center gap-2 font-pixel text-2xl text-rose-deep">
							<PixelIcon name="disk" size={24} />
							<span>ERROR: MOTIVATION LOW</span>
						</div>
						<p class="font-mono text-xs leading-relaxed text-muted">
							system alert: developer motivation dropped below threshold due to an impromptu snack
							break.
						</p>
						<div
							class="border-2 border-dashed border-line-strong bg-cream p-2.5 font-mono text-xs text-ink"
						>
							<p class="font-semibold">battery level: {curiosity}%</p>
							<p class="mt-0.5 text-[11px] text-rose-deep">choose an emergency recovery option:</p>
						</div>
						<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
							<button
								type="button"
								class="pixel-btn justify-center !py-1.5 !text-xs"
								onclick={() => {
									boostCuriosity();
									pushToast('🍓 Nom nom! Motivation restored by 100%! *happy dance*');
								}}
							>
								Give Snack 🍓
							</button>
							<button
								type="button"
								class="pixel-btn justify-center !py-1.5 !text-xs"
								onclick={() => {
									pushToast('🐱 Purrrr! Mochi headbutts your cursor lovingly.');
								}}
							>
								Pet Mochi 🐱
							</button>
							<button
								type="button"
								class="pixel-btn pixel-btn--primary justify-center !py-1.5 !text-xs"
								onclick={() => {
									closeWindow('error');
									pushToast("✦ Back to coding! Let's build something cute.");
								}}
							>
								Keep Coding 💻
							</button>
						</div>
					</div>
				{:else}
					<div class="window-stack">
						<p class="font-mono text-[10px] tracking-wide text-muted">
							{win.kind === 'note' ? 'note' : 'file'} · {win.title}
						</p>
						<p class="text-sm leading-relaxed text-ink">{win.blurb ?? ''}</p>

						<a href={win.href ?? '#home'} class="pixel-btn pixel-btn--ghost !min-h-9 !text-sm">
							open {win.title}
							<span aria-hidden="true">↗</span>
						</a>
					</div>
				{/if}
			</DesktopWindow>
		{/each}

		<div class="toast-stack" aria-live="polite">
			{#each toasts as toast (toast.id)}
				<div class="toast">{toast.message}</div>
			{/each}
		</div>

		<div class="taskbar" role="toolbar" aria-label="Desktop taskbar">
			<div class="taskbar__start">
				<button
					type="button"
					class="start-button"
					aria-expanded={startOpen}
					aria-controls="desktop-start-menu"
					onclick={() => (startOpen = !startOpen)}
				>
					<PixelIcon name={startOpen ? 'close' : 'smiley'} size={16} />
					<span>start</span>
				</button>

				{#if startOpen}
					<nav id="desktop-start-menu" class="start-menu" aria-label="Start menu">
						{#each navItems as item (item.href)}
							<a href={item.href} onclick={() => (startOpen = false)}>
								<PixelIcon name={item.icon} size={14} />
								{item.label}
							</a>
						{/each}
						<button type="button" onclick={resetDesktop}>
							<PixelIcon name="disk" size={14} />
							reset desktop
						</button>
					</nav>
				{/if}
			</div>

			<div class="taskbar__windows">
				{#each taskbarWindows as win (win.id)}
					<button
						type="button"
						class={[
							'taskbar__window-btn',
							{
								'is-active': activeId === win.id && !win.minimized,
								'is-minimized': win.minimized
							}
						]}
						aria-label={`${win.minimized ? 'Restore' : 'Focus'} ${win.title}`}
						onclick={() => toggleTaskbarWindow(win.id)}
					>
						<PixelIcon name={win.icon} size={12} />
						<span>{win.title}</span>
					</button>
				{/each}
			</div>

			<div class="taskbar__status">
				<span class="status-dot" aria-hidden="true"></span>
				<span class="taskbar__status-text">{site.status}</span>
				<time>{clock}</time>
			</div>
		</div>
	</div>
</section>

<style>
	.desktop-shell {
		width: 100%;
		border: 3px solid var(--line-strong);
		box-shadow: 8px 8px 0 0 var(--shadow);
		background: var(--surface);
	}

	.desktop-surface {
		position: relative;
		min-height: 560px;
		overflow: hidden;
		background-color: var(--surface-2);
		background-image: radial-gradient(var(--dot) 1px, transparent 1px);
		background-size: 12px 12px;
		padding-bottom: 58px;
	}

	@media (min-width: 640px) {
		.desktop-surface {
			min-height: 650px;
		}
	}

	.desktop-icons {
		position: absolute;
		top: 12px;
		left: 10px;
		z-index: 2;
		display: flex;
		width: 80px;
		flex-direction: column;
		gap: 6px;
	}

	.desktop-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border: 2px solid transparent;
		background: transparent;
		padding: 5px 2px;
		color: var(--ink);
		text-align: center;
		transition: background-color 140ms ease;
	}

	.desktop-icon:hover,
	.desktop-icon:focus-visible {
		border-color: var(--line-strong);
		background: color-mix(in srgb, var(--bubblegum) 50%, transparent);
	}

	.desktop-icon.is-hidden {
		opacity: 0.55;
	}

	.desktop-icon__art {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 2px solid var(--line-strong);
		background: var(--surface);
		color: var(--rose-deep);
		box-shadow: 2px 2px 0 0 var(--shadow);
	}

	.desktop-icon__label {
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.1;
	}

	.sticker-layer {
		position: absolute;
		inset: 0;
		z-index: 4;
		pointer-events: none;
	}

	.window-stack {
		display: grid;
		gap: 0.9rem;
	}

	.toast-stack {
		position: absolute;
		right: 12px;
		bottom: 66px;
		z-index: 70;
		display: grid;
		max-width: min(320px, calc(100% - 24px));
		gap: 6px;
		pointer-events: none;
	}

	.toast {
		border: 2px solid var(--line-strong);
		background: var(--cream);
		box-shadow: 3px 3px 0 0 var(--shadow);
		padding: 0.5rem 0.7rem;
		color: var(--plum-deep);
		font-family: var(--font-mono);
		font-size: 11px;
		animation: toast-in 200ms ease both;
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.taskbar {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 50;
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 0.5rem;
		border-top: 3px solid var(--line-strong);
		background: var(--plum);
		padding: 0.3rem 0.5rem;
		color: var(--cream);
	}

	:global(.dark) .taskbar {
		background: var(--plum-deep);
	}

	.taskbar__start {
		position: relative;
		flex: none;
	}

	.start-button {
		display: inline-flex;
		height: 34px;
		align-items: center;
		gap: 0.35rem;
		border: 2px solid var(--line-strong);
		background: var(--bubblegum);
		padding: 0 0.55rem;
		color: var(--plum-deep);
		font-family: var(--font-pixel);
		font-size: 0.95rem;
	}

	.start-button:hover {
		background: var(--surface);
	}

	.start-menu {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 0;
		z-index: 60;
		display: grid;
		min-width: 190px;
		gap: 2px;
		border: 3px solid var(--line-strong);
		background: var(--surface);
		box-shadow: 5px 5px 0 0 var(--shadow);
		padding: 0.4rem;
		color: var(--ink);
	}

	.start-menu a,
	.start-menu button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 2px solid transparent;
		background: transparent;
		padding: 0.35rem 0.5rem;
		color: var(--ink);
		font-family: var(--font-pixel);
		font-size: 0.95rem;
		text-align: left;
		text-decoration: none;
	}

	.start-menu a:hover,
	.start-menu button:hover {
		border-color: var(--line-strong);
		background: var(--bubblegum-soft);
	}

	.taskbar__windows {
		display: flex;
		flex: 1;
		gap: 0.35rem;
		overflow-x: auto;
	}

	.taskbar__window-btn {
		display: inline-flex;
		max-width: 170px;
		flex: none;
		align-items: center;
		gap: 0.35rem;
		overflow: hidden;
		border: 2px solid var(--line-strong);
		background: var(--surface);
		padding: 0.3rem 0.5rem;
		color: var(--ink);
		font-family: var(--font-mono);
		font-size: 10px;
		white-space: nowrap;
	}

	.taskbar__window-btn span {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.taskbar__window-btn.is-active {
		background: var(--bubblegum);
		color: var(--plum-deep);
	}

	.taskbar__window-btn.is-minimized {
		opacity: 0.7;
	}

	.taskbar__status {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 10px;
	}

	@media (max-width: 720px) {
		.taskbar__status-text {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.desktop-icon,
		.toast {
			animation: none;
			transition: none;
		}
	}
</style>
