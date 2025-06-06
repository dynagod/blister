import { MessageFlags, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import aiTalkManager from "../../manager/aiTalkManager.js";

export const data = new SlashCommandBuilder()
  .setName("start_ai_talk")
  .setDescription("Start AI auto-response in this channel");

export async function execute(interaction) {
  const channelId = interaction.channel.id;
  const isChannelActive = aiTalkManager.isChannelActive(channelId);

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply('You do not have permission to enable AI talk.');

  if (isChannelActive) return await interaction.reply({ content: "AI talk is already enabled", flags: [MessageFlags.Ephemeral] })

  aiTalkManager.startChannel(channelId);

  await interaction.reply("🧠 AI talk has been enabled in this channel!");
}