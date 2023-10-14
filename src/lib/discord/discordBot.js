import { REST } from "@discordjs/rest";
const token = import.meta.env.VITE_BOT_TOKEN;
export const rest = new REST({ version: "10" }).setToken(token);