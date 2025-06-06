import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Get the avatar of specific user')
  .addUserOption(option => 
    option
      .setName('target')
      .setDescription('The user to get avatar of')
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('target') || interaction.user;

  const embed = new EmbedBuilder()
    .setTitle(`${user.tag}'s Avatar`)
    .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setColor('#00AAFF');

  await interaction.reply({ embeds: [embed] });
}