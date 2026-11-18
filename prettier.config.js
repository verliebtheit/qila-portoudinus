/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	// Keep whatever line endings the checkout already has (Windows = CRLF),
	// so `prettier --check` doesn't flag every untouched file.
	endOfLine: 'auto',
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	tailwindStylesheet: './src/routes/layout.css'
};

export default config;
