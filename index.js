import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import config from './config/config.js';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup client
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// Register commands collection
client.commands = new Collection();

// Dynamically load commands from the /commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(pathToFileURL(path.join(commandsPath, file)).href);
  client.commands.set(command.data.name, command);
}

// Dynamically load events from the /events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = await import(pathToFileURL(path.join(eventsPath, file)).href);

  // Ensure the event is a function and call it with the client
  if (typeof event.default === 'function') {
    event.default(client);  // Call the event handler function
  } else {
    console.error(`The event handler in ${file} is not a function!`);
  }
}

// Login the bot
client.login(config.token);