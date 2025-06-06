import { MessageFlags, SlashCommandBuilder } from "discord.js";
import ms from "ms";

export const data = new SlashCommandBuilder()
  .setName('remind')
  .setDescription('Set a reminder for yourself')
  .addStringOption(option => 
    option
      .setName('time')
      .setDescription('How much time to wait before the reminder (e.g. 10m, 1h, 1d)')
      .setRequired(true)
  )
  .addStringOption(option => 
    option
      .setName('message')
      .setDescription('Your reminder message')
      .setRequired(true)
  );

export async function execute(interaction) {
  const timeString = interaction.options.getString('time');
  const message = interaction.options.getString('message');

  const time = ms(timeString);

  if (!time) return await interaction.reply({ content: 'Invalid time format. Please use something like `10m`, `1h`, or `1d`.', flags: [MessageFlags.Ephemeral] });

  await interaction.reply({ content: `Reminder set for ${ms(time, { long: true })}! I'll remind you about: "${message}"`, flags: [MessageFlags.Ephemeral] });

  setTimeout(async () => {
    await interaction.user.send(`⏰ Reminder: \`${message}\``);
  }, time);
}