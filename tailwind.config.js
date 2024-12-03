import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				'heebo': ['Heebo', 'sans-serif'],
			},
			colors: {
				'space-grey': {
					50: '#f6f6f8',
					100: '#e7e7ec',
					200: '#d4d4dd',
					300: '#b5b5c6',
					400: '#8e8ea3',
					500: '#2e2e3e', // existing space-grey-500
					600: '#262633',
					700: '#1f1f28',
					800: '#18181f',
					900: '#141419', // existing space-grey
					950: '#0c0c0f',
				},
			},
		}
	},

	plugins: [typography, forms, containerQueries]
};
