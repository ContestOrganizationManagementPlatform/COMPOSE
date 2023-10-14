
/**
 * Parse configuration data from either environment variables, command line
 * arguments, or a local file.  The local file containing the actual
 * configuration should not be checked into source control.
 */



const config = {
  DISCORD_TOKEN: process.env.VITE_BOT_TOKEN,
  DISCORD_CLIENT_ID: process.env.VITE_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.VITE_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: process.env.VITE_REDIRECT_URI,
  COOKIE_SECRET: process.env.VITE_COOKIE_SECRET,
};

export default config;
