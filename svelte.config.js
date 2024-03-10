import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess(), optimizeImports(), vitePreprocess({})],
	kit: {
		adapter: adapter(),
	},
};

export default config;
