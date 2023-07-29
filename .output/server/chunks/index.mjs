import { Client, IntentsBitField, AttachmentBuilder } from 'discord.js';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';
import { i as isYouTubeLink, g as getYouTubeVideoId } from './ytLinks.mjs';
import { s as str } from './str.mjs';

const EVO_CLIENT_ID = "1056463118672351283";
const EVO_ROLE_ID = "1056465043279052833";
const EVO_GUILD_ID = "730345526360539197";
const EVO_TOTAL_MEMBERS_CHANNERL_ID = "1113758792430145547";
const EVO_LOG_CHANNEL_ID = "1113752420623851602";
const EVO_VERIFIED_ROLE_ID = "1106198793935917106";

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
    var _a, _b, _c, _d;
    if (!interaction.isChatInputCommand())
      return;
    `dc@${(_a = interaction.member) == null ? void 0 : _a.user.id}`;
    interaction.channelId;
    switch (interaction.commandName) {
      case "yt-captions":
        {
          const videoLink = ((_b = interaction.options.get("id")) == null ? void 0 : _b.value) || "";
          const lang = ((_c = interaction.options.get("lang")) == null ? void 0 : _c.value) || "";
          const videoId = isYouTubeLink(videoLink) ? getYouTubeVideoId(videoLink) || "" : videoLink;
          if (!videoId) {
            interaction.reply("Error: Illegal Video ID");
            return;
          }
          try {
            const replied = interaction.reply("Processing...");
            const video = await crawlYouTubeVideo(videoId);
            const captions = (await video.getCaptions(lang)).map((caption) => caption.text).join("\n");
            const textFile = new AttachmentBuilder(Buffer.from(captions, "utf8"), { name: `${video.title}.txt`, description: video.description });
            const attatchment = await ((_d = interaction.channel) == null ? void 0 : _d.send({ files: [textFile] }));
            (await replied).edit((attatchment == null ? void 0 : attatchment.url) || "DONE");
          } catch (err) {
            interaction.reply(str(err));
          }
        }
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
