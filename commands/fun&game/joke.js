import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Get a random joke");

export async function execute(interaction) {
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
    const jokeData = await response.json();
    
    if (jokeData.type === 'single') {
      await interaction.reply(jokeData.joke);
    } else {
      await interaction.reply(`${jokeData.setup}\n\n${jokeData.delivery}`);
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    await interaction.reply('Sorry, I couldn\'t fetch a joke right now. Please try again later!');
  }
}