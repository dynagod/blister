import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('')
    .setDescription('')
    .addUserOption(option => 
        option
            .setName('target')
            .setDescription('the user to get info about')
            .setRequired(false)
    );

export async function execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s info`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Bot?', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.name).join(', ') || 'None' : 'Unknown' }
      )
      .setColor('#00AAFF');

    await interaction.reply({ embeds: [embed] });
}