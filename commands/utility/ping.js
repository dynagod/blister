import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Get the bot's latency");

export async function execute(interaction) {
  const startTime = Date.now();
  const reply = await interaction.reply({
    content: "Pinging...",
    withResponse: true,
  });

  const endTime = Date.now();
  const latency = endTime - startTime;
  const apiLatency = interaction.client.ws.ping;

  await interaction.editReply({
    content: `Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`,
  });
}