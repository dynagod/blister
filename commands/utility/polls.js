import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a poll with yes/no reaction')
  .addStringOption(option =>
      option.setName('question')
        .setDescription('The question for the poll')
        .setRequired(true)
    );

export async function execute(interaction) {
    const question = interaction.options.getString('question');

    const pollEmbed = new EmbedBuilder()
      .setTitle('Poll')
      .setDescription(question)
      .setColor('#00AAFF')
      .setFooter({ text: 'React with ✅ for Yes or ❌ for No' });

    await interaction.reply({
      content: 'Creating your poll...',
      flags: [MessageFlags.Ephemeral]
    });

    const pollMessage = await interaction.followUp({
      embeds: [pollEmbed],
    });

    await pollMessage.react('✅');
    await pollMessage.react('❌');
}