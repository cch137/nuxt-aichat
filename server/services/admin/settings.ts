import discordBot from "~/server/services/discord/index";

function getSettings() {
  return {
    dcBotConnected: discordBot.connected,
  };
}

export { getSettings };
