import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute the member from the server')
    .addUserOption((option) => 
        option
            .setName('username')
            .setDescription('Enter the member who you want to mute from the server')
            .setRequired(true)
    );

export async function execute(interaction) {
    const userNeedToMute = interaction.options.getUser('username');
    const member = interaction.guild.members.cache.get(userNeedToMute.id);
    const bot = interaction.guild.members.me;

    // Check if the bot has permission to mute
    if (!bot.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return interaction.reply('I do not have permission to mute members.');
    }

    // Check if the member exists in the server
    if (!member) {
        return interaction.reply(`\`${userNeedToMute.tag}\` not found in the server.`);
    }

    // Check if the bot can mute the target user (roles and hierarchy check)
    if (member.roles.highest.position >= bot.roles.highest.position) {
        return interaction.reply(`I cannot mute \`${userNeedToMute.tag}\` because they have a higher or equal role than me.`);
    }

    // Try to fetch the member's voice state if they are in a channel
    try {
        await member.voice.fetch(); // Force sync voice state
    } catch (error) {
        // Handle error for members who are not in a voice state
        if (error.code === 10065) {
            return interaction.reply(`\`${userNeedToMute.tag}\` is not in a voice channel.`);
        }
        console.error('Error fetching voice state:', error);
        return interaction.reply(`There was an error while trying to mute \`${userNeedToMute.tag}\`'s voice state.`);
    }

    // Check if the member is already muted
    if (member.voice.serverMute) {
        return interaction.reply(`\`${userNeedToMute.tag}\` is already muted.`);
    }

    // Mute the member
    try {
        await member.voice.setMute(true, 'Muted by command');
        return interaction.reply(`\`${userNeedToMute.tag}\` has been muted successfully.`);
    } catch (error) {
        console.error('Error muting member:', error);
        return interaction.reply(`There was an error trying to mute \`${userNeedToMute.tag}\`.`);
    }
}