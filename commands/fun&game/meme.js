import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get a random meme");

export async function execute(interaction) {
  try {
    const response = await fetch("https://meme-api.com/gimme/1");
    const data = await response.json();
  
    const meme = data.memes[0];
    const memeImage = meme.url;
    const memeTitle = meme.title;
    const memeAuthor = meme.author;
    const memePostLink = meme.postLink;
    const memeSubreddit = meme.subreddit
  
    const embed = new EmbedBuilder()
      .setTitle(`${memeTitle} - Posted by ${memeAuthor}`)
      .setDescription(`[Link to Post](${memePostLink})`)
      .setImage(memeImage)
      .setColor('#FF4500')
      .setFooter({ text: `From r/${memeSubreddit}` });
  
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching meme:', error);
    await interaction.reply('Sorry, I couldn\'t fetch a meme right now. Please try again later!');
  }
}