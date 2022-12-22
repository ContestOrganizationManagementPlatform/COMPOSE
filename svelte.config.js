import adapter from "@sveltejs/adapter-auto";
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		optimizeImports()
	],
	kit: {
		adapter: adapter(),
	},
};

export default config;
