import { sveltekit } from "@sveltejs/kit/vite";
import fs from "vite-plugin-fs";
import builtins from "rollup-plugin-node-builtins";

const builtinsPlugin = {
  ...builtins({ crypto: false }),
  name: "builtins",
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), fs(), builtinsPlugin],
	server: {
		port: 3000,
	}
};

export default config;
