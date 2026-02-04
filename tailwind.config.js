/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				display: [
					'Baloo 2',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
				sans: [
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				]
			},
			colors: {
				// Nacho cheese orange - primary brand color
				nacho: {
					50: '#FFF7ED',
					100: '#FFEDD5',
					200: '#FED7AA',
					300: '#FDBA74',
					400: '#FB923C',
					500: '#F59E0B', // Main nacho cheese orange
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					950: '#451A03'
				},
				// Spice red - for MEGA SPICE flavor
				spice: {
					50: '#FEF2F2',
					100: '#FEE2E2',
					200: '#FECACA',
					300: '#FCA5A5',
					400: '#F87171',
					500: '#EF4444', // MEGA SPICE red
					600: '#DC2626',
					700: '#B91C1C',
					800: '#991B1B',
					900: '#7F1D1D',
					950: '#450A0A'
				},
				// Cheddar gold - for Cheddar is Beddar
				cheddar: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706', // Cheddar gold
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					950: '#451A03'
				},
				// Cream - off-white for backgrounds
				cream: {
					50: '#FFFFFF',
					100: '#FFF8F0', // Main cream background
					200: '#FFF1E0',
					300: '#FFE9D0',
					400: '#FFE1C0',
					500: '#FFD9B0'
				},
				// Mozzarella blue - for Mozz Pure flavor
				mozz: {
					50: '#EFF6FF',
					100: '#DBEAFE',
					200: '#BFDBFE',
					300: '#93C5FD',
					400: '#60A5FA',
					500: '#3B82F6',
					600: '#2563EB',
					700: '#1D4ED8',
					800: '#1E40AF'
				},
				// White cheese - clean neutral gray for White Cheese Sauce
				'white-cheese': {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#E5E5E5',
					300: '#D4D4D4',
					400: '#A3A3A3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626'
				}
			},
			keyframes: {
				flameFlicker: {
					'0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
					'50%': { transform: 'scale(1.1) translateY(-5px)', opacity: '0.85' }
				},
				heatShimmer: {
					'0%, 100%': { transform: 'translateX(0) skewX(0deg)' },
					'25%': { transform: 'translateX(2px) skewX(1deg)' },
					'75%': { transform: 'translateX(-2px) skewX(-1deg)' }
				},
				cheeseDrip: {
					'0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
					'100%': { transform: 'scaleY(1)', transformOrigin: 'top' }
				},
				wobbleIn: {
					'0%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
					'100%': { transform: 'rotate(0deg)' }
				}
			},
			animation: {
				'flame-flicker': 'flameFlicker 0.3s ease-in-out infinite',
				'heat-shimmer': 'heatShimmer 0.2s ease-in-out infinite',
				'cheese-drip': 'cheeseDrip 0.8s ease-out forwards',
				'wobble-in': 'wobbleIn 0.5s ease-out'
			}
		}
	},
	plugins: []
};
