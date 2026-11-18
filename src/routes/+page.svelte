<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { about, contact, navItems, projects, site, skillGroups } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import PixelIcon from '$lib/components/PixelIcon.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Window from '$lib/components/Window.svelte';

	let { form }: { form: ActionData } = $props();

	type Status = 'idle' | 'loading' | 'success' | 'error';

	let dark = $state(false);
	let ready = $state(false);
	let menuOpen = $state(false);
	let status = $state<Status>('idle');
	let loadingBar = $state(58);
	let clock = $state('--:--');

	const marqueeItems = [
		'learning by building',
		'pink pixels & curiosity',
		'programming · technology · game dev',
		'gaming · photography · music'
	];

	const formMessage = $derived(form?.message ?? 'Could not send your message. Please try again.');

	function readDark(): boolean {
		try {
			const saved = localStorage.getItem('qila.theme');
			if (saved === 'dark') return true;
			if (saved === 'light') return false;
		} catch {
			/* ignore */
		}
		return document.documentElement.classList.contains('dark');
	}

	onMount(() => {
		dark = readDark();
		ready = true;

		const tick = () => {
			clock = new Intl.DateTimeFormat(undefined, {
				hour: '2-digit',
				minute: '2-digit'
			}).format(new Date());
		};
		tick();
		const clockTimer = setInterval(tick, 30_000);

		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const barTimer = reduced
			? undefined
			: setInterval(() => {
					loadingBar =
						loadingBar >= 96 ? 42 : Math.min(98, loadingBar + Math.floor(Math.random() * 8) + 2);
				}, 2400);

		const onResize = () => {
			if (window.innerWidth >= 1024) menuOpen = false;
		};
		window.addEventListener('resize', onResize);

		return () => {
			clearInterval(clockTimer);
			if (barTimer) clearInterval(barTimer);
			window.removeEventListener('resize', onResize);
		};
	});

	$effect(() => {
		if (!ready) return;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('qila.theme', dark ? 'dark' : 'light');
		} catch {
			/* ignore */
		}
	});

	function toggleTheme() {
		dark = !dark;
	}

	function nudgeLoading() {
		loadingBar = loadingBar >= 96 ? 48 : Math.min(99, loadingBar + 10);
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
	}}
/>

<div class="min-h-dvh text-ink">
	<a href="#home" class="skip-link" onclick={closeMenu}>skip to content</a>

	<header class="sticky top-0 z-40 border-b-[3px] border-line-strong bg-bg/95 backdrop-blur-sm">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
			<a
				href="#home"
				class="group flex shrink-0 items-center gap-2 font-pixel text-xl text-ink sm:text-2xl"
				aria-label="{site.brand} — back to the top"
				onclick={closeMenu}
			>
				<span
					class="grid h-9 w-9 place-items-center border-2 border-line-strong bg-primary text-plum-deep shadow-[2px_2px_0_0_var(--shadow)] transition group-hover:-translate-y-0.5"
					aria-hidden="true"
				>
					<PixelIcon name="heart" size={18} />
				</span>
				<span>{site.brand}</span>
				<span class="blink-cursor" aria-hidden="true"></span>
			</a>

			<div class="flex items-center gap-2">
				<nav class="hidden items-center gap-1 lg:flex" aria-label="Primary">
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							class="pixel-border-sm flex items-center gap-2 bg-surface px-3 py-2 font-pixel text-base text-ink transition hover:-translate-y-0.5 hover:bg-pink hover:text-plum-deep"
						>
							<PixelIcon name={item.icon} size={15} />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<span
					class="hidden items-center gap-1.5 border-2 border-line-strong bg-surface px-2 py-1.5 font-mono text-[11px] text-muted sm:inline-flex"
					aria-label="Local time"
				>
					<PixelIcon name="clock" size={12} class="text-rose-deep" />
					<time>{clock}</time>
				</span>

				<button
					type="button"
					onclick={toggleTheme}
					class="flex h-11 w-11 items-center justify-center border-2 border-line-strong bg-surface text-ink shadow-[3px_3px_0_0_var(--shadow)] transition hover:-translate-y-0.5 hover:bg-pink hover:text-plum-deep"
					aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
					aria-pressed={dark}
					title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
				>
					<PixelIcon name={dark ? 'sun' : 'moon'} size={18} />
				</button>

				<button
					type="button"
					class="flex h-11 items-center gap-2 border-2 border-line-strong bg-surface px-3 text-ink shadow-[3px_3px_0_0_var(--shadow)] transition hover:-translate-y-0.5 hover:bg-pink hover:text-plum-deep lg:hidden"
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={menuOpen}
					aria-controls="mobile-menu"
					onclick={() => (menuOpen = !menuOpen)}
				>
					<PixelIcon name={menuOpen ? 'close' : 'menu'} size={16} />
					<span class="hidden font-pixel text-base sm:inline">menu</span>
				</button>
			</div>
		</div>

		<nav
			id="mobile-menu"
			class={`border-b-[3px] border-line-strong bg-bg/98 px-4 py-3 shadow-[0_6px_0_0_var(--shadow)] lg:hidden ${menuOpen ? 'block' : 'hidden'}`}
			aria-label="Mobile"
		>
			<div class="mx-auto grid max-w-6xl gap-2 sm:grid-cols-2">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						onclick={closeMenu}
						class="pixel-border-sm flex items-center gap-2.5 bg-surface px-3 py-3 font-pixel text-lg text-ink hover:bg-pink hover:text-plum-deep"
					>
						<span class="text-rose-deep" aria-hidden="true">
							<PixelIcon name={item.icon} size={16} />
						</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</div>
		</nav>
	</header>

	<main class="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
		<div
			class="pointer-events-none absolute left-1 top-28 hidden text-rose-deep/70 sticker-float xl:block"
			aria-hidden="true"
		>
			<PixelIcon name="star" size={30} />
		</div>
		<div
			class="pointer-events-none absolute -right-2 top-[42rem] hidden text-rose-deep/60 sticker-float xl:block"
			style="animation-delay: 1.2s"
			aria-hidden="true"
		>
			<PixelIcon name="heart" size={26} />
		</div>
		<div
			class="pointer-events-none absolute -left-3 top-[90rem] hidden text-sage sticker-float xl:block"
			style="animation-delay: 0.6s"
			aria-hidden="true"
		>
			<PixelIcon name="flower" size={30} />
		</div>

		<!-- HOME -->
		<section
			id="home"
			class="grid scroll-mt-28 gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch"
			aria-labelledby="hero-title"
		>
			<div use:reveal={{ y: 18 }}>
				<Window title={site.welcome} icon="monitor" class="h-full">
					<div class="space-y-5">
						<div class="flex flex-wrap items-center gap-2">
							<span
								class="inline-flex items-center gap-2 border-2 border-line-strong bg-sage px-2.5 py-1 font-mono text-xs text-plum-deep"
							>
								<span class="h-2 w-2 rounded-full bg-success animate-pulse" aria-hidden="true"></span>
								{site.status}
							</span>
							<span
								class="border-2 border-dashed border-line-soft bg-cream px-2.5 py-1 font-mono text-xs text-muted"
							>
								role: {site.role}
							</span>
						</div>

						<p class="font-mono text-xs text-muted">
							<span class="text-rose-deep">qila@desktop</span>:~$ hello
						</p>

						<div class="space-y-3">
							<h1
								id="hero-title"
								class="max-w-[13ch] font-pixel text-5xl leading-[0.92] text-ink sm:text-6xl lg:text-7xl"
							>
								{site.greeting}
							</h1>
							<p class="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
								{site.intro}
							</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<a href="#projects" class="pixel-btn pixel-btn--primary">
								open my projects
								<span aria-hidden="true">↗</span>
							</a>
							<a href="#about" class="pixel-btn">
								<PixelIcon name="user" size={16} />
								profile.exe
							</a>
						</div>

						<div class="border-2 border-line-strong bg-cream p-3">
							<div class="mb-2 flex items-center justify-between gap-3 font-mono text-xs text-muted">
								<span>booting qila.exe…</span>
								<span>{loadingBar}%</span>
							</div>
							<div class="h-5 border-2 border-line-strong bg-surface p-0.5" aria-hidden="true">
								<div
									class="h-full bg-[repeating-linear-gradient(90deg,var(--rose)_0_14px,var(--bubblegum)_14px_28px)] transition-[width] duration-500"
									style={`width: ${loadingBar}%`}
								></div>
							</div>
							<button
								type="button"
								onclick={nudgeLoading}
								class="mt-2 font-mono text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-ink"
							>
								click to boost loading ✦
							</button>
						</div>
					</div>
				</Window>
			</div>

			<div use:reveal={{ delay: 100 }}>
				<Window title="desktop_notes.txt" icon="star" class="h-full">
					<div class="space-y-5">
						<div class="relative border-2 border-dashed border-line-soft bg-cream p-4 retro-dots">
							<p class="font-pixel text-3xl text-ink">{site.name}</p>
							<p class="mt-1 font-mono text-xs text-muted">aka {site.brand} · {site.role}</p>
							<div class="mt-4 grid grid-cols-3 gap-2 text-center" aria-hidden="true">
								<div class="border-2 border-line-strong bg-pink py-3 text-plum-deep">
									<span class="mx-auto block w-fit"><PixelIcon name="heart" size={18} /></span>
									<span class="mt-1 block font-mono text-[10px]">cute</span>
								</div>
								<div class="border-2 border-line-strong bg-sage py-3 text-plum-deep">
									<span class="mx-auto block w-fit"><PixelIcon name="flower" size={18} /></span>
									<span class="mt-1 block font-mono text-[10px]">cozy</span>
								</div>
								<div class="border-2 border-line-strong bg-surface py-3 text-ink">
									<span class="mx-auto block w-fit text-rose-deep"
										><PixelIcon name="star" size={18} /></span
									>
									<span class="mt-1 block font-mono text-[10px]">curious</span>
								</div>
							</div>
						</div>

						<div>
							<p class="font-pixel text-xl text-ink">a few things i love</p>
							<ul class="mt-2 flex flex-wrap gap-2">
								{#each site.interests as interest (interest.label)}
									<li
										class="inline-flex items-center gap-1.5 border-2 border-line-strong bg-cream px-2.5 py-1 font-mono text-[11px] text-ink"
									>
										<span class="text-rose-deep" aria-hidden="true">
											<PixelIcon name={interest.icon} size={13} />
										</span>
										{interest.label}
									</li>
								{/each}
							</ul>
						</div>

						<div
							class="border-2 border-line-strong bg-surface px-4 py-3 font-mono text-xs leading-relaxed text-muted"
						>
							<span class="text-rose-deep">note:</span> this site is a little retro corner of the internet
							— still learning, still building, and having fun with it.
						</div>
					</div>
				</Window>
			</div>
		</section>

		<!-- marquee / now playing -->
		<div class="mt-5" use:reveal={{ delay: 140 }}>
			<div class="pixel-border-sm overflow-hidden bg-surface">
				<div
					class="flex items-center gap-2 border-b-2 border-line-strong bg-cream px-3 py-1.5 font-mono text-xs text-muted"
				>
					<span class="text-rose-deep" aria-hidden="true"><PixelIcon name="music" size={13} /></span>
					<span>now_playing.txt</span>
					<span class="ml-auto hidden sm:inline">loop / on</span>
				</div>
				<div class="overflow-hidden py-2.5">
					<div class="marquee-track flex items-center">
						{#each [false, true] as hidden, half (half)}
							<ul
								class="flex shrink-0 items-center gap-8 pr-8 font-mono text-sm text-muted"
								aria-hidden={hidden ? 'true' : undefined}
							>
								{#each marqueeItems as item, index (index)}
									<li class="inline-flex items-center gap-2">
										<span class="text-rose-deep" aria-hidden="true"
											><PixelIcon name="star" size={12} /></span
										>
										{item}
									</li>
								{/each}
							</ul>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- ABOUT -->
		<section id="about" class="scroll-mt-28 pt-16 lg:pt-24" aria-label="About Qila">
			<div use:reveal>
				<Window title="profile.exe — about me" icon="user">
					<div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
						<div class="space-y-4">
							<p class="text-lg leading-relaxed text-ink sm:text-xl">{about.intro}</p>
							<p class="text-base leading-relaxed text-muted sm:text-lg">{about.background}</p>
							<p class="text-base leading-relaxed text-muted sm:text-lg">{about.hobbies}</p>
						</div>

						<div class="space-y-3">
							<div class="grid gap-3 sm:grid-cols-2">
								{#each about.details as detail (detail.label)}
									<div class="border-2 border-line-strong bg-cream px-4 py-3">
										<p class="font-mono text-[10px] tracking-wide text-muted uppercase">
											{detail.label}
										</p>
										<p class="mt-1 font-semibold text-ink">{detail.value}</p>
									</div>
								{/each}
							</div>

							<div class="pixel-border-sm bg-surface p-4 retro-dots">
								<p class="font-pixel text-2xl text-ink">personality</p>
								<p class="mt-1 font-mono text-xs leading-relaxed text-muted">
									Creative, curious, playful, and a little quirky — I like projects that feel personal
									and a bit like me.
								</p>
							</div>
						</div>
					</div>
				</Window>
			</div>
		</section>

		<!-- PROJECTS -->
		<section id="projects" class="scroll-mt-28 pt-16 lg:pt-24" aria-label="Projects">
			<div use:reveal>
				<Window title="my_projects/ — projects" icon="folder">
					<div class="mb-5 flex flex-wrap items-end justify-between gap-3">
						<p class="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
							A small collection of things I’ve worked on or explored as a student developer. Each card
							is a little preview of what I’ve been learning.
						</p>
						<span
							class="border-2 border-dashed border-line-soft bg-cream px-3 py-1 font-mono text-xs text-muted"
						>
							{projects.length} items found
						</span>
					</div>

					<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{#each projects as project, index (project.title)}
							<ProjectCard {project} {index} />
						{/each}
					</div>
				</Window>
			</div>
		</section>

		<!-- SKILLS -->
		<section id="skills" class="scroll-mt-28 pt-16 lg:pt-24" aria-label="Skills">
			<div use:reveal>
				<Window title="skills.exe — skills" icon="star">
					<div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<p class="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
							I’m still learning and growing, so this is an honest snapshot of where I am right now —
							curious, practicing, and getting better bit by bit.
						</p>
						<span
							class="inline-flex w-fit items-center gap-2 border-2 border-line-strong bg-sage px-3 py-1 font-mono text-xs text-plum-deep"
						>
							<span aria-hidden="true"><PixelIcon name="check" size={12} /></span>
							beginner-friendly progress
						</span>
					</div>

					<div class="grid gap-4 lg:grid-cols-3">
						{#each skillGroups as group, index (group.title)}
							<section
								use:reveal={{ delay: index * 80 }}
								class="pixel-border-sm flex h-full flex-col bg-cream p-4"
								aria-label={group.title}
							>
								<div
									class="mb-3 flex items-center justify-between gap-2 border-b-2 border-dotted border-line-soft pb-2"
								>
									<h3 class="font-pixel text-2xl text-ink">{group.title}</h3>
									<span class="text-rose-deep" aria-hidden="true">
										<PixelIcon name="star" size={16} />
									</span>
								</div>
								<p class="mb-4 text-sm leading-relaxed text-muted">{group.note}</p>
								<ul class="mt-auto flex flex-wrap gap-2">
									{#each group.items as item (item)}
										<li
											class="inline-flex items-center gap-1.5 border-2 border-line-strong bg-surface px-3 py-1.5 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--shadow)]"
										>
											<span class="text-rose-deep" aria-hidden="true">
												<PixelIcon name="check" size={11} />
											</span>
											{item}
										</li>
									{/each}
								</ul>
							</section>
						{/each}
					</div>
				</Window>
			</div>
		</section>

		<!-- CONTACT -->
		<section id="contact" class="scroll-mt-28 pt-16 lg:pt-24" aria-label="Contact">
			<div use:reveal>
				<Window title="contact.exe — contact" icon="mail">
					<div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
						<div class="space-y-4">
							<div class="pixel-border-sm bg-cream p-4">
								<p class="font-pixel text-3xl text-ink">let’s connect!</p>
								<p class="mt-2 text-base leading-relaxed text-muted sm:text-lg">
									{contact.invite}
								</p>
								<p
									class="mt-3 border-t-2 border-dotted border-line-soft pt-3 font-mono text-xs leading-relaxed text-muted"
								>
									{contact.note}
								</p>
							</div>

							<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
								{#if contact.github}
									<a
										href={contact.github}
										target="_blank"
										rel="noopener noreferrer"
										class="pixel-border-sm flex items-center justify-between bg-surface px-4 py-3 font-pixel text-xl text-ink transition hover:-translate-y-0.5 hover:bg-pink hover:text-plum-deep"
									>
										<span class="inline-flex items-center gap-2">
											<PixelIcon name="github" size={17} />
											GitHub
										</span>
										<span aria-hidden="true">↗</span>
									</a>
								{:else}
									<div
										class="pixel-border-sm flex items-center justify-between bg-surface px-4 py-3 font-pixel text-xl text-ink"
									>
										<span class="inline-flex items-center gap-2">
											<PixelIcon name="github" size={17} />
											GitHub
										</span>
										<span class="font-mono text-xs text-muted">link pending</span>
									</div>
								{/if}

								{#if contact.email}
									<a
										href={`mailto:${contact.email}`}
										class="pixel-border-sm flex items-center justify-between bg-surface px-4 py-3 font-pixel text-xl text-ink transition hover:-translate-y-0.5 hover:bg-pink hover:text-plum-deep"
									>
										<span class="inline-flex items-center gap-2">
											<PixelIcon name="mail" size={17} />
											Email
										</span>
										<span aria-hidden="true">✉</span>
									</a>
								{:else}
									<div
										class="pixel-border-sm flex items-center justify-between bg-surface px-4 py-3 font-pixel text-xl text-ink"
									>
										<span class="inline-flex items-center gap-2">
											<PixelIcon name="mail" size={17} />
											Email
										</span>
										<span class="font-mono text-xs text-muted">coming soon</span>
									</div>
								{/if}
							</div>
						</div>

						<div class="pixel-border-sm bg-surface p-4 sm:p-5">
							<div
								class="mb-4 flex items-center gap-2 border-b-2 border-dotted border-line-soft pb-3"
							>
								<span class="text-rose-deep" aria-hidden="true"
									><PixelIcon name="mail" size={20} /></span
								>
								<div>
									<p class="font-pixel text-2xl text-ink">send_message.exe</p>
									<p class="font-mono text-xs text-muted">a tiny retro message form</p>
								</div>
							</div>

							<form
								method="POST"
								action="?/kirim"
								use:enhance={() => {
									status = 'loading';
									return async ({ result, update }) => {
										await update({ reset: result.type === 'success' });
										status = result.type === 'success' ? 'success' : 'error';
									};
								}}
								class="space-y-4"
							>
								<label class="block">
									<span class="mb-1 block font-mono text-xs text-muted">NAME</span>
									<input
										name="nama"
										required
										autocomplete="name"
										placeholder="Your name"
										class="h-12 w-full border-2 border-line-strong bg-cream px-3 font-sans text-base text-ink placeholder:text-muted/70 focus:border-rose-deep"
									/>
								</label>

								<label class="block">
									<span class="mb-1 block font-mono text-xs text-muted">EMAIL</span>
									<input
										name="email"
										type="email"
										required
										autocomplete="email"
										placeholder="you@example.com"
										class="h-12 w-full border-2 border-line-strong bg-cream px-3 font-sans text-base text-ink placeholder:text-muted/70 focus:border-rose-deep"
									/>
								</label>

								<label class="block">
									<span class="mb-1 block font-mono text-xs text-muted">MESSAGE</span>
									<textarea
										name="pesan"
										required
										rows="5"
										placeholder="Write a friendly little message..."
										class="min-h-[140px] w-full border-2 border-line-strong bg-cream px-3 py-2 font-sans text-base text-ink placeholder:text-muted/70 focus:border-rose-deep"
									></textarea>
								</label>

								<button
									type="submit"
									disabled={status === 'loading'}
									class="pixel-btn pixel-btn--primary w-full justify-center disabled:cursor-wait"
								>
									{#if status === 'loading'}
										<PixelIcon name="disk" size={16} />
										Sending…
									{:else}
										Send message
									{/if}
								</button>

								{#if status === 'success'}
									<div
										class="border-2 border-line-strong bg-sage px-4 py-3 font-mono text-xs text-plum-deep"
										role="status"
									>
										✓ Message sent! Thank you for stopping by.
									</div>
								{:else if status === 'error'}
									<div
										class="border-2 border-line-strong bg-pink px-4 py-3 font-mono text-xs text-plum-deep"
										role="alert"
									>
										! {formMessage}
									</div>
								{/if}
							</form>
						</div>
					</div>
				</Window>
			</div>
		</section>
	</main>

	<footer class="border-t-[3px] border-line-strong bg-surface/80">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
		>
			<div class="flex items-center gap-3">
				<span
					class="grid h-10 w-10 shrink-0 place-items-center border-2 border-line-strong bg-pink text-plum-deep shadow-[3px_3px_0_0_var(--shadow)]"
					aria-hidden="true"
				>
					<PixelIcon name="heart" size={20} />
				</span>
				<div>
					<p class="font-pixel text-2xl text-ink">
						{site.brand}
						<span class="blink-cursor" aria-hidden="true"></span>
					</p>
					<p class="font-mono text-xs text-muted">
						Made with curiosity, pink pixels, and lots of learning.
					</p>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
				<a href="#home" class="underline decoration-dotted underline-offset-4 hover:text-ink">
					back to top ↑
				</a>
				<span aria-hidden="true">·</span>
				<span class="inline-flex items-center gap-1.5">
					<span class="text-rose-deep" aria-hidden="true"><PixelIcon name="heart" size={11} /></span>
					© 2026 {site.name}
				</span>
				<span class="hidden sm:inline" aria-hidden="true">·</span>
				<time class="hidden sm:inline">{clock}</time>
			</div>
		</div>
	</footer>
</div>

<style>
	.sticker-float {
		animation: float-soft 6s ease-in-out infinite;
	}

	.marquee-track {
		width: max-content;
		animation: marquee-scroll 28s linear infinite;
		will-change: transform;
	}

	@media (prefers-reduced-motion: reduce) {
		.sticker-float,
		.marquee-track {
			animation: none;
		}
	}
</style>
