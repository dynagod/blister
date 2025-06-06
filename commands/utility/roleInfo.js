import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName('roleinfo')
  .setDescription('Get information about a specific role')
  .addRoleOption(option => 
    option
      .setName('role')
      .setDescription('The role to get info about')
      .setRequired(true)
  )

export async function execute(interaction) {
    const role = interaction.options.getRole('role');
    
    const embed = new EmbedBuilder()
      .setTitle(`${role.name} role info`)
      .setColor(role.color)
      .addFields(
        { name: 'Role Name', value: role.name, inline: true },
        { name: 'Role ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Creation Date', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Members with this Role', value: `${role.members.size}`, inline: true }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
}