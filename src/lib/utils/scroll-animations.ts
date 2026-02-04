import { fly, scale } from 'svelte/transition';
import { quintOut, elasticOut, backOut } from 'svelte/easing';

export const flavorAnimations = {
	'white-cheese': {
		transition: fly,
		params: { y: 30, duration: 400, easing: quintOut }
	},
	'orange-spice': {
		transition: scale,
		params: { start: 0.8, duration: 400, easing: elasticOut }
	},
	'mozz-pure': {
		transition: fly,
		params: { y: -50, duration: 500, easing: backOut }
	},
	'cheddar-beddar': {
		transition: scale,
		params: { start: 0.7, duration: 300, easing: backOut }
	},
	'mega-spice': {
		transition: scale,
		params: { start: 1.3, duration: 600, easing: elasticOut, opacity: 0 }
	}
};

export function getFlavorAnimation(flavorId: string) {
	return flavorAnimations[flavorId as keyof typeof flavorAnimations] || flavorAnimations['white-cheese'];
}
