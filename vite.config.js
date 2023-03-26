import { sveltekit } from "@sveltejs/kit/vite";
import builtins from "rollup-plugin-node-builtins";

const builtinsPlugin = {
	...builtins({ crypto: false }),
	name: "builtins",
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), builtinsPlugin],
	server: {
		port: 3000,
	},
	ssr: {
		noExternal: ["chart.js"],
	},
};

export default config;
