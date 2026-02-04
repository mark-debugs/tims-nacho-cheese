import { spring } from 'svelte/motion';
import { prefersReducedMotion } from '$lib/utils/animations';

export function cheeseStretch(node: HTMLElement) {
	// Skip animation if user prefers reduced motion
	if (prefersReducedMotion()) {
		return { destroy() {} };
	}

	const scaleSpring = spring(1, { stiffness: 0.1, damping: 0.25 });

	const unsubscribe = scaleSpring.subscribe((value) => {
		node.style.transform = `scale(${value})`;
	});

	function handleMouseEnter() {
		scaleSpring.set(1.05);
	}

	function handleMouseLeave() {
		scaleSpring.set(1);
	}

	node.addEventListener('mouseenter', handleMouseEnter);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			unsubscribe();
			node.removeEventListener('mouseenter', handleMouseEnter);
			node.removeEventListener('mouseleave', handleMouseLeave);
		}
	};
}
