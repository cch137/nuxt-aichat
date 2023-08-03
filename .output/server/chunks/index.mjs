import { Client, IntentsBitField, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';
import { C as Conversation, c as curva, i as isYouTubeLink, g as getYouTubeVideoId } from './index2.mjs';
import { s as str } from './random.mjs';

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
const createTextFile = (filename, content) => {
  return new AttachmentBuilder(Buffer.from(content, "utf8"), { name: filename });
};
const connect = async () => {
  var _a;
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
  (_a = client.user) == null ? void 0 : _a.setActivity({
    name: "https://ch4.onrender.com",
    url: "https://ch4.onrender.com",
    type: 0
  });
  client.on("messageCreate", async (message) => {
    var _a2;
    if (message.author.bot) {
      return;
    }
    if (message.guildId !== EVO_GUILD_ID) {
      return;
    }
    const { content } = message;
    if (content.includes(`<@${EVO_CLIENT_ID}>`) || content.includes(`<@${EVO_ROLE_ID}>`)) {
      const user = `dc@${(_a2 = message.member) == null ? void 0 : _a2.user.id}`;
      const conv = message.channelId;
      const replied = message.reply("Thinking...");
      const interval = setInterval(() => {
        message.channel.sendTyping();
      }, 3e3);
      try {
        replied.then(() => message.channel.sendTyping());
        const question = message.content.replaceAll(`<@${EVO_CLIENT_ID}>`, "").trim() || "Hi";
        const messages = [...await new Conversation(user, conv).getContext(), { role: "user", content: question }];
        const response = await curva.ask(user, conv, "gpt-web", 0, messages, 0);
        const { answer: answer2, error } = response;
        const queries = (response == null ? void 0 : response.queries) || [];
        const urls = (response == null ? void 0 : response.urls) || [];
        if (error) {
          throw error;
        }
        const embeds = (() => {
          if (queries.length + urls.length === 0) {
            return [];
          }
          const embed = new EmbedBuilder();
          embed.setTitle("References");
          embed.setColor("Blue");
          embed.setFields(...[
            { name: "Queries", value: `${queries.join("\n")}` },
            { name: "Urls", value: `${urls.join("\n")}` }
          ].filter((l) => l.value));
          return [embed];
        })();
        const files = answer2.length > 1e3 ? [createTextFile("answer.txt", answer2)] : [];
        message.reply(files.length ? { files, embeds } : { content: answer2, embeds });
      } catch (err) {
        console.log(err);
        message.reply({
          content: "",
          embeds: [
            new EmbedBuilder().setDescription(err === "THINKING" ? "Request denied. Please wait for the reply to the previous question to complete." : `ERROR: ${str(err)}`).setColor("Red")
          ]
        });
      } finally {
        (await replied).delete();
        clearInterval(interval);
      }
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
    var _a2, _b, _c;
    if (!interaction.isChatInputCommand())
      return;
    switch (interaction.commandName) {
      case "clear-chatbot-memory":
        const user = `dc@${(_a2 = interaction.member) == null ? void 0 : _a2.user.id}`;
        const conv = interaction.channelId;
        await new Conversation(user, conv).delete();
        interaction.reply({ embeds: [new EmbedBuilder().setDescription("The conversation history between you and the AI chatbot in this channel has been cleared.").setColor("Green")] });
        break;
      case "yt-captions":
        {
          const videoLink = ((_b = interaction.options.get("id")) == null ? void 0 : _b.value) || "";
          const lang = ((_c = interaction.options.get("lang")) == null ? void 0 : _c.value) || "";
          const videoId = isYouTubeLink(videoLink) ? getYouTubeVideoId(videoLink) || "" : videoLink;
          if (!videoId) {
            interaction.reply("Error: Illegal Video ID");
            return;
          }
          const replied = interaction.reply("Processing...");
          try {
            const video = await crawlYouTubeVideo(videoId);
            const captions = (await video.getCaptions(lang)).map((caption) => caption.text).join("\n");
            const textFile = createTextFile(`${video.title}.txt`, captions);
            (await replied).edit({ content: video.url, files: [textFile] });
          } catch (err) {
            (await replied).edit(str(err));
          }
        }
        break;
    }
  });
  console.log(`DC BOT conneted.`);
  return loggedIn;
};
if (+process.env.RUN_DC_BOT) {
  connect().then(() => {
    var _a;
    (_a = store.client.application) == null ? void 0 : _a.commands.create({
      name: "clear-chatbot-memory",
      description: "Clear the conversation history between you and the AI chatbot in this channel."
    });
  });
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
