<script lang="ts">
	import { enhance } from '$app/forms';
	import PixelIcon from './PixelIcon.svelte';

	type Props = {
		message?: string;
	};

	let { message }: Props = $props();

	type Status = 'idle' | 'loading' | 'success' | 'error';

	let status = $state<Status>('idle');
	let errorText = $derived(message ?? 'Could not send your message. Please try again.');

	const fieldClass =
		'h-12 w-full border-2 border-line-strong bg-cream px-3 font-sans text-base text-ink placeholder:text-muted focus:border-rose-deep';
</script>

<form
	method="POST"
	action="?/kirim"
	use:enhance={() => {
		status = 'loading';
		return async ({ result, update }) => {
			await update({ reset: result.type === 'success' });
			if (result.type === 'success') status = 'success';
			else if (result.type === 'failure' || result.type === 'error') status = 'error';
			else status = 'idle';
		};
	}}
	class="space-y-4"
	aria-labelledby="contact-form-title"
>
	<div class="flex items-center gap-3 border-b-2 border-dotted border-line pb-3">
		<span
			class="grid size-9 shrink-0 place-items-center border-2 border-line-strong bg-primary text-on-primary"
			aria-hidden="true"
		>
			<PixelIcon name="mail" size={18} />
		</span>
		<div>
			<p id="contact-form-title" class="font-pixel text-xl leading-none text-ink">
				new_message.txt
			</p>
			<p class="mt-1 font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
				to: qila · from: you
			</p>
		</div>
	</div>

	<label class="block">
		<span class="mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-ink uppercase">name</span
		>
		<input name="nama" required autocomplete="name" placeholder="Your name" class={fieldClass} />
	</label>

	<label class="block">
		<span class="mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-ink uppercase"
			>email</span
		>
		<input
			name="email"
			type="email"
			required
			autocomplete="email"
			placeholder="you@example.com"
			class={fieldClass}
		/>
	</label>

	<label class="block">
		<span class="mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-ink uppercase"
			>message</span
		>
		<textarea
			name="pesan"
			required
			rows="5"
			placeholder="Write a friendly little message..."
			class="min-h-[132px] w-full resize-y border-2 border-line-strong bg-cream px-3 py-2.5 font-sans text-base text-ink placeholder:text-muted focus:border-rose-deep"
		></textarea>
	</label>

	<button
		type="submit"
		disabled={status === 'loading'}
		class="pixel-btn w-full disabled:cursor-wait"
	>
		{#if status === 'loading'}
			<span class="inline-flex items-center gap-2">
				<PixelIcon name="disk" size={16} class="animate-bob" />
				sending...
			</span>
		{:else}
			<span class="inline-flex items-center gap-2">
				send message
				<PixelIcon name="arrow" size={16} />
			</span>
		{/if}
	</button>

	{#if status === 'success'}
		<div
			class="flex items-start gap-2 border-2 border-line-strong bg-sage px-3 py-2.5 font-mono text-[11px] leading-relaxed text-plum-deep"
			role="status"
		>
			<PixelIcon name="check" size={14} class="mt-0.5 shrink-0" />
			<span>Message sent! Thank you for stopping by — I'll write back soon.</span>
		</div>
	{:else if status === 'error'}
		<div
			class="flex items-start gap-2 border-2 border-line-strong bg-bubblegum-soft px-3 py-2.5 font-mono text-[11px] leading-relaxed text-ink"
			role="alert"
		>
			<PixelIcon name="close" size={14} class="mt-0.5 shrink-0" />
			<span>{errorText}</span>
		</div>
	{/if}

	<p class="font-mono text-[10px] leading-relaxed text-muted">
		Goes straight to my inbox. No newsletters, no spam — just a friendly note.
	</p>
</form>
