import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import config from "./config.js";

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register commands collection
client.commands = new Collection();

// Dynamically load commands from the /commands directory
const commandsPath = path.join(__dirname, "commands");
const commandFiles = [];

(async function () {
  try {
    const files = await fs.promises.readdir(commandsPath, {
      withFileTypes: true,
    });

    // Filter out directories
    const directories = files
      .filter((file) => file.isDirectory())
      .map((file) => path.join(commandsPath, file.name));

    // Loop over each directory
    for (const dir of directories) {
      const jsFiles = await fs.promises.readdir(dir);
      const commandJsFiles = jsFiles.filter((file) => file.endsWith(".js"));

      // Add the filtered js files to the commandFiles array
      commandFiles.push(...commandJsFiles.map((file) => path.join(dir, file)));
    }

    for (const file of commandFiles) {
      try {
        // Ensure the path is absolute, then convert it to a valid file URL
        const commandPath = pathToFileURL(file).href;

        // Dynamically import the command file
        const command = await import(commandPath);

        // Check if the command has the expected structure
        if (command.data && command.data.name) {
          client.commands.set(command.data.name, command);
        } else {
          console.warn(
            `Skipping invalid command file: ${file} (Missing data.name)`
          );
        }
      } catch (err) {
        console.error(`Error loading command file: ${file}`, err);
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
})();

// Dynamically load events from the /events directory
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = await import(pathToFileURL(path.join(eventsPath, file)).href);

  // Ensure the event is a function and call it with the client
  if (typeof event.default === "function") {
    event.default(client); // Call the event handler function
  } else {
    console.error(`The event handler in ${file} is not a function!`);
  }
}

// Login the bot
client.login(config.token);
