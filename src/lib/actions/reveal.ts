import type { Action } from 'svelte/action';

type RevealParams = {
	delay?: number;
	y?: number;
};

/**
 * Fade/slide content in when it scrolls into view.
 * Usage: `use:reveal` or `use:reveal={{ delay: 80, y: 16 }}`
 */
export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params = {}) => {
	let delay = params?.delay ?? 0;
	let y = params?.y ?? 16;

	const reduce =
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduce || typeof IntersectionObserver === 'undefined') {
		node.style.opacity = '1';
		node.style.transform = 'none';
		return { destroy() {} };
	}

	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = `opacity 520ms ease ${delay}ms, transform 520ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);

	observer.observe(node);

	return {
		update(next = {}) {
			delay = next.delay ?? 0;
			y = next.y ?? 16;
		},
		destroy() {
			observer.disconnect();
		}
	};
};
