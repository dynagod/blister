import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout the member from the server')
    .addUserOption((option) => 
        option
            .setName('username')
            .setDescription('Enter the member you want to give a timeout from the server')
            .setRequired(true),
    )
    .addNumberOption((option) => 
        option
            .setName('time')
            .setDescription('Enter the time for the timeout')
            .setRequired(true),
    )
    .addStringOption((option) => 
        option
            .setName('duration')
            .setDescription('Duration for the timeout')
            .setRequired(true)
            .addChoices(
                {name: 'seconds', value: 'seconds'},
                {name: 'minutes', value: 'minutes'},
                {name: 'hours', value: 'hours'},
                {name: 'days', value: 'days'},
            ),
    );

export async function execute(interaction) {
    const userToBeTimeouted = interaction.options.getUser('username');
    const time = interaction.options.getNumber('time');
    const duration = interaction.options.getString('duration');
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

    // Check if the invoking user has permission to moderate members
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return interaction.reply('You do not have permission to timeout members.');
    }

    // Check if the bot can moderate the target user (roles and hierarchy check)
    if (member.roles.highest.position >= bot.roles.highest.position) {
        return interaction.reply(`I cannot timeout \`${userToBeTimeouted.tag}\` because they have a higher or equal role than me.`);
    }

    // Check if the invoking user has higher role than the target member
    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply(`You cannot timeout \`${userToBeTimeouted.tag}\` because they have a higher or equal role than you.`);
    }

    // Convert time to milliseconds based on the selected duration
    let timeoutDuration;
    switch (duration) {
        case 'seconds':
            timeoutDuration = time * 1000; // Convert seconds to ms
            break;
        case 'minutes':
            timeoutDuration = time * 60 * 1000; // Convert minutes to ms
            break;
        case 'hours':
            timeoutDuration = time * 60 * 60 * 1000; // Convert hours to ms
            break;
        case 'days':
            timeoutDuration = time * 24 * 60 * 60 * 1000; // Convert days to ms
            break;
        default:
            return interaction.reply('Invalid duration specified.');
    }

    // Check if the timeout duration exceeds the maximum allowed (28 days)
    const maxTimeoutDuration = 28 * 24 * 60 * 60 * 1000; // 28 days in milliseconds
    if (timeoutDuration > maxTimeoutDuration) {
        return interaction.reply('The maximum allowed timeout duration is 28 days.');
    }

    // Timeout the member
    try {
        await member.timeout(timeoutDuration, 'Timeout due to violation');
        return interaction.reply(`\`${userToBeTimeouted.tag}\` has been timed out for ${time} ${duration}.`);
    } catch (error) {
        console.error('Error timeouting member:', error);
        return interaction.reply(`There was an error trying to timeout \`${userToBeTimeouted.tag}\`.`);
    }
}