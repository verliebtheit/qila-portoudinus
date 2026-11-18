import tailwindcss from '@tailwindcss/vite';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterAuto from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) }
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Vercel deployments must use the Vercel adapter. Locally we fall back to
			// adapter-auto so Windows builds can complete (adapter-vercel's final
			// symlink step can fail with EPERM on some Windows setups).
			adapter: process.env.VERCEL ? adapterVercel() : adapterAuto()
		})
	]
});
