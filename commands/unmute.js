import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute the member from the server')
    .addUserOption((option) => 
        option
            .setName('username')
            .setDescription('Enter the member who you want to unmute from the server')
            .setRequired(true)
    );

export async function execute(interaction) {
    const userNeedToUnmute = interaction.options.getUser('username');
    const member = interaction.guild.members.cache.get(userNeedToUnmute.id);
    const bot = interaction.guild.members.me;

    // Check if the bot has permission to mute/unmute
    if (!bot.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return interaction.reply('I do not have permission to unmute members.');
    }

    // Check if the member exists in the server
    if (!member) {
        return interaction.reply(`\`${userNeedToUnmute.tag}\` not found in the server.`);
    }

    // Check if the invoking user has permission to mute/unmute
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return interaction.reply('You do not have permission to unmute members.');
    }

    // Check if the invoking user has higher role than the target member
    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply(`You cannot unmute \`${userNeedToUnmute.tag}\` because they have a higher or equal role than you.`);
    }

    // Check if the bot can unmute the target user (roles and hierarchy check)
    if (member.roles.highest.position >= bot.roles.highest.position) {
        return interaction.reply(`I cannot unmute \`${userNeedToUnmute.tag}\` because they have a higher or equal role than me.`);
    }

    // Try to fetch the member's voice state if they are in a channel
    try {
        await member.voice.fetch(); // Force sync voice state
    } catch (error) {
        // Handle error for members who are not in a voice state
        if (error.code === 10065) {
            return interaction.reply(`\`${userNeedToUnmute.tag}\` is not in a voice channel.`);
        }
        console.error('Error fetching voice state:', error);
        return interaction.reply(`There was an error while trying to unmute \`${userNeedToUnmute.tag}\`'s voice state.`);
    }

    // Check if the member is not muted
    if (!member.voice.serverMute) {
        return interaction.reply(`\`${userNeedToUnmute.tag}\` is already unmuted.`);
    }

    // Unmute the member
    try {
        await member.voice.setMute(false, 'Unmuted by command');
        return interaction.reply(`\`${userNeedToUnmute.tag}\` has been unmuted successfully.`);
    } catch (error) {
        console.error('Error unmuting member:', error);
        return interaction.reply(`There was an error trying to unmute \`${userNeedToUnmute.tag}\`.`);
    }
}