/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui'), require('@tailwindcss/typography')],
	daisyui: {
		themes: [ "winter", "cupcake", "dark"],
		darkTheme: "dark"
	}
};
