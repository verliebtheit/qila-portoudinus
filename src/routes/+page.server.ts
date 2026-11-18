import { fail } from '@sveltejs/kit';
import { RESEND_API_KEY, RESEND_TO } from '$app/env/private';
import type { Actions } from './$types';

export const actions = {
	kirim: async ({ request }) => {
		const data = await request.formData();

		const nama = String(data.get('nama') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const pesan = String(data.get('pesan') ?? '').trim();

		if (!nama || !email || !pesan) {
			return fail(400, { message: 'Please fill in all fields.' });
		}

		if (!email.includes('@')) {
			return fail(400, { message: 'Please enter a valid email address.' });
		}

		const kunci = RESEND_API_KEY;
		const tujuan = RESEND_TO;

		if (!kunci || !tujuan) {
			return fail(500, { message: 'Message sending is not set up yet.' });
		}

		const balasan = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${kunci}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: 'qila.exe <onboarding@resend.dev>',
				to: [tujuan],
				reply_to: email,
				subject: `Message from ${nama}`,
				text: `${pesan}

-- ${nama} <${email}>`
			})
		});

		if (!balasan.ok) {
			console.error('Resend rejected request:', balasan.status, await balasan.text());
			return fail(502, { message: 'Could not send your message. Please try again.' });
		}

		return { success: true };
	}
} satisfies Actions;
