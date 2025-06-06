const aiTalkChannels = new Set();
aiTalkChannels.add('1380564504538120324');

export default {
  startChannel(channelId) {
    aiTalkChannels.add(channelId);
  },
  stopChannel(channelId) {
    aiTalkChannels.delete(channelId);
  },
  isChannelActive(channelId) {
    return aiTalkChannels.has(channelId);
  }
};