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
				'space-grey': '#707070'
			},

		}
	},

	plugins: [typography, forms, containerQueries]
};
