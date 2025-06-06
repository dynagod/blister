import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('remove_timeout')
    .setDescription('Remove timeout from the member in the server')
    .addUserOption((option) => 
        option
            .setName('username')
            .setDescription('Enter the member who you want to remove the timeout from')
            .setRequired(true),
    );

export async function execute(interaction) {
    const userToBeTimeouted = interaction.options.getUser('username');
    const member = interaction.guild.members.cache.get(userToBeTimeouted.id);
    const bot = interaction.guild.members.me;

    // Check if the bot has permission to moderate members
    if (!bot.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return interaction.reply('I do not have permission to moderate members.');
    }

    // Check if the member exists in the server
    if (!member) {
        return interaction.reply(`\`${userToBeTimeouted.tag}\` not found in the server.`);
    }

    // Check if the bot can moderate the target user (roles and hierarchy check)
    if (member.roles.highest.position >= bot.roles.highest.position) {
        return interaction.reply(`I cannot remove timeout for \`${userToBeTimeouted.tag}\` because they have a higher or equal role than me.`);
    }

    // Check if the invoker has permission to moderate
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return interaction.reply('You do not have permission to remove timeouts from members.');
    }

    // Check if the member is currently in timeout
    if (!(member.communicationDisabledUntil && member.communicationDisabledUntil > Date.now())) {
        return interaction.reply(`\`${userToBeTimeouted.tag}\` is not currently in timeout.`);
    }

    // Remove the timeout from the member
    try {
        await member.timeout(null, 'Removed timeout manually');
        return interaction.reply(`\`${userToBeTimeouted.tag}\`'s timeout has been removed.`);
    } catch (error) {
        console.error('Error removing timeout from member:', error);
        return interaction.reply(`There was an error trying to remove the timeout from \`${userToBeTimeouted.tag}\`.`);
    }
}
