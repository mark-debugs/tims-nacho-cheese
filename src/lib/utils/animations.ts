import { spring, tweened } from 'svelte/motion';
import { quintOut, elasticOut, cubicOut, linear } from 'svelte/easing';

/**
 * Animation utilities for Tim's Nacho Cheese site
 * Bouncy, cheese-themed animation presets
 */

// ===== SPRING PRESETS =====

/**
 * High bounce, low damping - for hover effects and card interactions
 */
export function bouncySpring(initial: number = 0) {
	return spring(initial, { stiffness: 0.1, damping: 0.25 });
}

/**
 * Subtle bounce - for nav show/hide and layout shifts
 */
export function gentleSpring(initial: number = 0) {
	return spring(initial, { stiffness: 0.05, damping: 0.4 });
}

/**
 * Quick snap with slight overshoot - for button clicks and toggles
 */
export function snappySpring(initial: number = 0) {
	return spring(initial, { stiffness: 0.3, damping: 0.6 });
}

// ===== TWEENED PRESETS =====

/**
 * Smooth ease-out transition
 */
export function smoothTween(initial: number = 0) {
	return tweened(initial, { duration: 400, easing: quintOut });
}

/**
 * Elastic overshoot effect
 */
export function elasticBounce(initial: number = 0) {
	return tweened(initial, { duration: 600, easing: elasticOut });
}

/**
 * Fast opacity transition
 */
export function quickFade(initial: number = 0) {
	return tweened(initial, { duration: 200, easing: linear });
}

// ===== TRANSITION PARAMETER PRESETS =====

/**
 * Fly in from above
 */
export const flyUp = { y: -20, duration: 300, easing: quintOut };

/**
 * Fly in from below
 */
export const flyDown = { y: 20, duration: 300, easing: quintOut };

/**
 * Scale in with elastic bounce
 */
export const scaleIn = { start: 0.8, duration: 300, easing: elasticOut };

/**
 * Subtle slide-fade entry
 */
export const fadeSlide = { y: 10, duration: 200, easing: quintOut };

// ===== BRAND ANIMATION CONSTANTS =====

/**
 * Standard duration values for consistent timing
 */
export const ANIMATION_DURATION = {
	fast: 150,
	normal: 300,
	slow: 500,
	bouncy: 600
} as const;

/**
 * Raw spring configurations for direct use
 */
export const SPRING_CONFIGS = {
	bouncy: { stiffness: 0.1, damping: 0.25 },
	gentle: { stiffness: 0.05, damping: 0.4 },
	snappy: { stiffness: 0.3, damping: 0.6 }
} as const;

// ===== ACCESSIBILITY UTILITIES =====

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
