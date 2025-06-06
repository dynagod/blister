import { CohereClient } from "cohere-ai";
import config from "../config.js";
import aiTalkManager from "../manager/aiTalkManager.js";

const cohere = new CohereClient({
  token: config.cohereKey,
});

export default (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!aiTalkManager.isChannelActive(message.channel.id)) return;

    try {
      const response = await cohere.chat({
        model: "command-r",
        message: message.content,
        chatHistory: [
          { role: "USER", message: "You are a helpful, friendly AI in a Discord server." },
          { role: "CHATBOT", message: "Ok" }
        ],
      });

      const aiResponse = response.text.trim();

      if (!aiResponse) {
        await message.channel.send("⚠️ Couldn't generate a response.");
        return;
      }

      await message.channel.send(aiResponse);
    } catch (error) {
      console.error("AI talk error:", error);
      await message.channel.send("⚠️ Sorry, I couldn't generate a response right now.");
    }
  });
};