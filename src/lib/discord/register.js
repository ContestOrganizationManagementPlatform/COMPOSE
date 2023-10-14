import fetch from 'node-fetch';
import config from './config.js';

/**
 * Register the metadata to be stored by Discord. This should be a one time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${config.DISCORD_CLIENT_ID}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7
const body = [
  {
    key: 'verified',
    name: 'Verified',
    description: 'Is Verified on COMPOSE',
    type: 7,
  },
  {
    key: 'problemswritten',
    name: 'Problems Written',
    description: 'Written more problems than',
    type: 2,
  },
  {
    key: 'permissions',
    name: 'COMPOSE Permissions',
    description: 'Permissions greater than',
    type: 2,
  },
];

const response = await fetch(url, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${config.DISCORD_TOKEN}`,
  },
});
if (response.ok) {
  const data = await response.json();
  console.log(data);
} else {
  //throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
  const data = await response.text();
  console.log(data);
}
