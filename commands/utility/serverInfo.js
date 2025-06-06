import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("serverinfo")
  .setDescription("Get information about a server");

export async function execute(interaction) {
  const guild = interaction.guild;

  // Create an embed with server info
  const embed = new EmbedBuilder()
    .setTitle(`${guild.name} Server Info`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "Server Name", value: guild.name, inline: true },
      { name: "Server ID", value: guild.id, inline: true },
      { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
      { name: "Total Members", value: `${guild.memberCount}`, inline: true },
      { name: "Roles Count", value: `${guild.roles.cache.size}`, inline: true },
      {
        name: "Channels Count",
        value: `${guild.channels.cache.size}`,
        inline: true,
      },
      {
        name: "Creation Date",
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
      { name: "Region", value: guild.preferredLocale, inline: true }
    )
    .setColor("#00AAFF");

  await interaction.reply({ embeds: [embed] });
}
