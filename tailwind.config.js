/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
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
				}
			}
		}
	},
	plugins: []
};
