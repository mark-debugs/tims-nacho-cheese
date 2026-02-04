export type InviewOptions = {
	rootMargin?: string;
	threshold?: number;
	once?: boolean;
};

// Augment HTMLAttributes to include our custom event handlers
declare global {
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'oninview_enter'?: (event: CustomEvent) => void;
			'oninview_exit'?: (event: CustomEvent) => void;
		}
	}
}

export function inview(node: HTMLElement, options: InviewOptions = {}) {
	const { rootMargin = '50px', threshold = 0.1, once = true } = options;

	let hasEntered = false;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				// Guard against 0-height elements falsely reporting as intersecting
				// (happens when {#if} renders nothing, leaving container at 0px height)
				if (entry.isIntersecting && entry.boundingClientRect.height > 0) {
					node.dispatchEvent(new CustomEvent('inview_enter'));
					hasEntered = true;
					if (once) {
						observer.disconnect();
					}
				} else if (!once && hasEntered && !entry.isIntersecting) {
					node.dispatchEvent(new CustomEvent('inview_exit'));
				}
			});
		},
		{ rootMargin, threshold }
	);

	observer.observe(node);

	// Handle scroll restoration: if the element is already above the viewport
	// (user refreshed or navigated back), it will never intersect going forward.
	// Immediately fire inview_enter for these "already passed" elements.
	requestAnimationFrame(() => {
		if (hasEntered) return;
		const rect = node.getBoundingClientRect();
		if (rect.height > 0 && rect.bottom < 0) {
			node.dispatchEvent(new CustomEvent('inview_enter'));
			hasEntered = true;
			if (once) {
				observer.disconnect();
			}
		}
	});

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
