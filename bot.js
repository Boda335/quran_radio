require("dotenv").config();
require("module-alias/register");
require("colors");
const { registerFont } = require('canvas');
const fontFile = './src/utils/fonts/Amiri-Regular.ttf';

registerFont(fontFile, { family: 'Amiri' });

require("events").EventEmitter.setMaxListeners(999999999)

const { GatewayIntentBits, Partials } = require("discord.js");
const Quran = require("@DevXor/DevXor");

let client = new Quran({
  token: process.env.token,
  database: {
    database_type: "MONGODB",
    MongoDB: {
      uri: process.env.mongodb_uri
    },
    options: {
      nested: '..',
      nestedIsEnabled: true,
      cache: {
        isEnabled: true,
        capacity: 2048
      }
    }
  }
});

// Connect the database BEFORE logging in (see index.js).
setTimeout(async function () {
  try {
    await client.DBConnect();
  } catch (err) {
    console.error("Database connection failed, exiting:".red, err.message);
    process.exit(1);
  }
  client.botlogin(process.env.token);
}, 2000);

client.on("shardError", (error) => console.log("shardError".red, error));
client.on("shardDisconnect", (event) => console.log("shardDisconnect".yellow, event));
client.on("shardReconnecting", (event) => console.log("shardReconnecting".bgGreen, event));
const IGNORED_DEBUG = [
  "[VOICE] received voice state update",
  "[VOICE] received voice server",
  "Failed to find guild, or unknown type for channel", // unsupported channel type (e.g. 20) - harmless
];
client.on("debug", (message) => {
  if (IGNORED_DEBUG.some((s) => message.includes(s))) return;
  console.log("debug".green, message);
});
module.exports = client;

//nodejs-events
process.on("unhandledRejection", e => {
  if (!e) retrun;
  console.log(e)
});

process.on("uncaughtException", e => {
  if (!e) return;
  console.log(e)
});

process.on("uncaughtExceptionMonitor", e => {
  if (!e) return
  console.log(e)
});