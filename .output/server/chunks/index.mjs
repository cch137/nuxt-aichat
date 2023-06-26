import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
import './index3.mjs';
import { m as message } from './message.mjs';
import { d as deleteConversation } from './deleteConversation.mjs';

const EVO_CLIENT_ID = "1056463118672351283";
const EVO_ROLE_ID = "1056465043279052833";
const EVO_GUILD_ID = "730345526360539197";
const EVO_TOTAL_MEMBERS_CHANNERL_ID = "1113758792430145547";
const EVO_LOG_CHANNEL_ID = "1113752420623851602";
const EVO_VERIFIED_ROLE_ID = "1106198793935917106";

const getJoinedMessages = (messages) => {
  return messages.map((message) => {
    return (message.Q ? `Question:
${message.Q}` : "") + (message.Q && message.A ? "\n\n" : "") + (message.A ? `Answer:
${message.A}` : "");
  }).filter((m) => m).join("\n---\n");
};
async function getContext(user, conv) {
  if (!(user && conv)) {
    return "";
  }
  const messages = (await message.find({
    user,
    conv
  }, {
    _id: 1,
    Q: 1,
    A: 1
  }).sort({ createdAt: -1 }).limit(100)).map((doc) => ({
    Q: doc.Q,
    A: doc.A,
    t: doc._id.getTimestamp().getTime()
  }));
  if (messages.length === 0) {
    return "";
  }
  let joinedMessages = getJoinedMessages(messages);
  while (joinedMessages.length > 8192) {
    messages.shift();
    joinedMessages = getJoinedMessages(messages);
  }
  return `Conversation History
===
${joinedMessages}`;
}

const store = {
  connected: false,
  updateMemberCount() {
    const { guild } = store;
    const memberChannelPromise = guild.channels.fetch(EVO_TOTAL_MEMBERS_CHANNERL_ID);
    guild.members.fetch({}).then(async () => {
      const totalMembers = guild.members.cache.size;
      const memberChannel = await memberChannelPromise;
      await memberChannel.setName(`Total members: ${totalMembers}`);
      console.log("Update Server Member Count:", totalMembers);
    });
  }
};
const Logger = {
  log(text) {
    Logger.channel.send(text);
  },
  typing() {
    Logger.channel.sendTyping();
  }
};
const DEPRECATED_MESSAGE = "This service has been deprecated.";
const reviewChat = async (message) => {
  if (!message.content.trim()) {
    return;
  }
  Logger.typing();
  if (typeof answer !== "string") {
    return;
  }
  const { guild } = store;
  guild.roles.fetch(EVO_VERIFIED_ROLE_ID).then((verifiedRole) => {
    guild.members.addRole({
      user: message.author,
      role: verifiedRole
    });
  });
};
const connect = async () => {
  if (store.client !== void 0) {
    bot.disconnect();
  }
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent
    ]
  });
  store.client = client;
  const loggedIn = await client.login(process.env.DC_BOT_TOKEN);
  store.guild = await client.guilds.fetch(EVO_GUILD_ID);
  Logger.channel = await client.channels.fetch(EVO_LOG_CHANNEL_ID);
  store.updateMemberCount();
  store.connected = true;
  client.on("messageCreate", async (message) => {
    if (message.author.bot) {
      return;
    }
    const { content } = message;
    if (content.includes(`<@${EVO_CLIENT_ID}>`) || content.includes(`<@${EVO_ROLE_ID}>`)) {
      message.reply(DEPRECATED_MESSAGE);
    } else {
      reviewChat(message);
    }
  });
  client.on("guildMemberAdd", () => {
    store.updateMemberCount();
  });
  client.on("guildMemberRemove", () => {
    store.updateMemberCount();
  });
  client.on("interactionCreate", async (interaction) => {
    var _a, _b, _c, _d, _e;
    if (!interaction.isChatInputCommand())
      return;
    const user = `dc@${(_a = interaction.member) == null ? void 0 : _a.user.id}`;
    const conv = interaction.channelId;
    switch (interaction.commandName) {
      case "chat":
        const reply = await interaction.reply("Thinking...");
        const interval = setInterval(() => {
          var _a2;
          (_a2 = interaction.channel) == null ? void 0 : _a2.sendTyping();
        }, 3e3);
        try {
          const question = ((_b = interaction.options.get("prompt")) == null ? void 0 : _b.value) || "Hi";
          const webBrowsing = ((_c = interaction.options.get("web-browsing")) == null ? void 0 : _c.value) || "OFF";
          const temperature = ((_d = interaction.options.get("temperature")) == null ? void 0 : _d.value) || "_t05";
          const context = await getContext(user, conv);
          const answer2 = DEPRECATED_MESSAGE;
          clearInterval(interval);
          const embed = new EmbedBuilder();
          embed.addFields(
            { name: "Reply to:", value: `<@${(_e = interaction.member) == null ? void 0 : _e.user.id}>` },
            { name: "Prompt:", value: question }
          );
          reply.edit({ content: answer2, embeds: [embed] });
        } catch (err) {
          clearInterval(interval);
          console.error(err);
          await reply.edit("Oops! Something went wrong.");
        }
        break;
      case "forget":
        const response = interaction.reply("Deleting conversation...");
        deleteConversation(user, conv).then(async () => {
          (await response).edit("The conversation has been reset.");
        }).catch(async () => {
          (await response).edit("Oops! Something went wrong.");
        });
        break;
    }
  });
  console.log(`DC BOT conneted.`);
  return loggedIn;
};
if (+process.env.RUN_DC_BOT) {
  connect();
}
const disconnect = () => {
  try {
    const { client } = store;
    if (client !== void 0) {
      client.destroy();
      console.log(`DC BOT Disconneted.`);
    }
  } finally {
    store.connected = false;
    delete store.client;
  }
};
const bot = {
  get connected() {
    return store.connected;
  },
  connect,
  disconnect
};
const discordBot = bot;

export { discordBot as d };
//# sourceMappingURL=index.mjs.map
