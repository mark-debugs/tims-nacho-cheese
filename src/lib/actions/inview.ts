export type InviewOptions = {
	rootMargin?: string;
	threshold?: number;
	once?: boolean;
};

export function inview(node: HTMLElement, options: InviewOptions = {}) {
	const { rootMargin = '50px', threshold = 0.1, once = true } = options;

	let hasEntered = false;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.dispatchEvent(new CustomEvent('inview_enter'));
					hasEntered = true;
					if (once) {
						observer.disconnect();
					}
				} else if (!once && hasEntered) {
					node.dispatchEvent(new CustomEvent('inview_exit'));
				}
			});
		},
		{ rootMargin, threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
