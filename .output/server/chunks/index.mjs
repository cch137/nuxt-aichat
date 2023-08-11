import { AttachmentBuilder, EmbedBuilder, Routes, Client, IntentsBitField } from 'discord.js';
import { s as str } from './random.mjs';
import { C as Conversation, c as curva, i as isYouTubeLink, g as getYouTubeVideoId } from './index2.mjs';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';

function createTextFile(filename, content) {
  return new AttachmentBuilder(Buffer.from(content, "utf8"), { name: filename });
}

const CLIENT_ID = "1056463118672351283";

const askCurva = async (user, conv, model, messageContent, temperature = 0.5) => {
  const question = messageContent.replaceAll(`<@${CLIENT_ID}>`, "").trim() || "Hi";
  const messages = [...await new Conversation(user, conv).getContext(), { role: "user", content: question }];
  try {
    const response = await curva.ask("discord", user, conv, model, temperature, messages, 0);
    const { answer, error } = response;
    if (error) {
      throw error;
    }
    const queries = (response == null ? void 0 : response.queries) || [];
    const urls = (response == null ? void 0 : response.urls) || [];
    const embeds = (() => {
      if (queries.length + urls.length === 0) {
        return [];
      }
      const embed = new EmbedBuilder();
      embed.setColor("Blue");
      embed.setFields(...[
        { name: "Queries", value: `${queries.join("\n")}` },
        { name: "Urls", value: `${urls.join("\n")}` }
      ].filter((l) => l.value));
      return [embed];
    })();
    const files = answer.length > 1e3 ? [createTextFile("answer.txt", answer)] : [];
    return { content: files.length === 0 ? answer : "", files, embeds };
  } catch (err) {
    console.log(err);
    return {
      content: "",
      embeds: [
        new EmbedBuilder().setDescription(err === "THINKING" ? "Request denied. Please wait for the reply to the previous question to complete." : `ERROR: ${str(err)}`).setColor("Red")
      ]
    };
  }
};
const handleInteractionForCurvaAsk = async (interaction, model) => {
  var _a, _b, _c, _d;
  const message = ((_a = interaction.options.get("message")) == null ? void 0 : _a.value) || "";
  const temperature = (_b = interaction.options.get("temperature")) == null ? void 0 : _b.value;
  const dcUid = ((_c = interaction.member) == null ? void 0 : _c.user.id) || "";
  if (dcUid === "") {
    interaction.reply({ embeds: [new EmbedBuilder().setDescription("Direct messaging with the bot is currently not supported.").setColor("Yellow")] });
    return;
  }
  const user = `dc@${dcUid}`;
  const conv = interaction.channelId;
  const replied = interaction.reply("Thinking...");
  const interval = setInterval(() => {
    try {
      interaction.channel.sendTyping();
    } catch {
    }
  }, 3e3);
  replied.then(() => {
    try {
      interaction.channel.sendTyping();
    } catch {
    }
  });
  const { content, embeds = [], files = [] } = await askCurva(user, conv, model, message, temperature === void 0 ? 0.5 : temperature);
  clearInterval(interval);
  const answered = await ((_d = interaction.channel) == null ? void 0 : _d.send({ content: `<@${dcUid}> ${content}`, embeds, files }));
  (await replied).edit({ content: answered == null ? void 0 : answered.url });
};
const handleInteractionForCurvaClearHistory = async (interaction) => {
  var _a;
  const user = `dc@${(_a = interaction.member) == null ? void 0 : _a.user.id}`;
  const conv = interaction.channelId;
  await new Conversation(user, conv).delete();
  interaction.reply({ embeds: [new EmbedBuilder().setDescription("The conversation history between you and the AI chatbot in this channel has been cleared.").setColor("Green")] });
};

async function handleInteractionForYTCaptions(interaction) {
  var _a, _b;
  const videoLink = ((_a = interaction.options.get("id")) == null ? void 0 : _a.value) || "";
  const lang = ((_b = interaction.options.get("lang")) == null ? void 0 : _b.value) || "";
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _guild;
class CH4GuildCache {
  constructor(client, guildId, channels, roles) {
    __publicField(this, "client");
    __publicField(this, "guildId");
    __privateAdd(this, _guild, void 0);
    __publicField(this, "channels");
    __publicField(this, "roles");
    this.client = client;
    this.guildId = guildId;
    this.channels = channels;
    this.roles = roles;
  }
  async getGuild() {
    if (!__privateGet(this, _guild)) {
      __privateSet(this, _guild, await this.client.guilds.fetch(this.guildId));
      this.client.guilds.cache.clear();
    }
    return __privateGet(this, _guild);
  }
  async updateMemberCount(channelId) {
    const guild = await this.getGuild();
    const channel = await guild.channels.fetch(channelId);
    guild.channels.cache.clear();
    if (channel === null) {
      console.log("Update Server Member Count Failed: Channel not exists");
      return;
    }
    const totalMembers = (await guild.members.fetch({})).size;
    guild.members.cache.clear();
    channel.setName(`Total members: ${totalMembers}`);
    console.log("Update Server Member Count:", totalMembers);
  }
  async addRoleToUser(user, roleId) {
    await this.client.rest.put(Routes.guildMemberRole(this.guildId, user.id, roleId));
  }
  async removeUserRole(user, roleId) {
    await this.client.rest.delete(Routes.guildMemberRole(this.guildId, user.id, roleId));
  }
  isOwnMessage(message) {
    return message.guildId === this.guildId;
  }
}
_guild = new WeakMap();
const CH4GuildCache$1 = CH4GuildCache;

let client = null;
async function disconnect() {
  const t0 = Date.now();
  if (client !== null) {
    const oldClient = client;
    client = null;
    try {
      await oldClient.destroy();
    } catch {
    }
  }
  console.log(`DC BOT disconneted in ${Date.now() - t0} ms`);
}
async function connect() {
  var _a;
  const t0 = Date.now();
  if (client !== null) {
    if (client.isReady()) {
      return;
    }
    await disconnect();
  }
  client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions
    ]
  });
  await client.login(process.env.DC_BOT_TOKEN);
  const ch4Guild = new CH4GuildCache$1(client, "730345526360539197", {
    botLogger: { id: "1113752420623851602" },
    totalMembers: { id: "1113758792430145547" }
  }, {
    verified: { id: "1106198793935917106" },
    ch4: { id: "1056465043279052833" },
    explorer: { id: "1133371837179506738" }
  });
  async function ch4UpdateMemberCount() {
    return await ch4Guild.updateMemberCount(ch4Guild.channels.totalMembers.id);
  }
  await ch4UpdateMemberCount();
  try {
    (_a = client.user) == null ? void 0 : _a.setActivity({
      name: "https://ch4.onrender.com",
      url: "https://ch4.onrender.com",
      type: 0
    });
  } catch (err) {
    console.log("DCBOT setActivity Failed:", err);
  }
  (async () => {
    const reactionEmoji = "\u2728";
    const getRoleChannelId = "1138887783927263283";
    const getRoleMessageId = "1138889775487668224";
    const guild = await ch4Guild.getGuild();
    const getRoleMessage = await (await guild.channels.fetch(getRoleChannelId)).messages.fetch(getRoleMessageId);
    guild.channels.cache.clear();
    getRoleMessage.react(reactionEmoji);
    client.on("messageReactionAdd", async (reaction, user) => {
      if (client === null || reaction.message.id !== getRoleMessageId || reaction.message.channelId !== getRoleChannelId || reaction.emoji.name !== reactionEmoji || reaction.emoji.id !== null || user.bot || !ch4Guild.isOwnMessage(reaction.message)) {
        return;
      }
      ch4Guild.addRoleToUser(user, ch4Guild.roles.explorer.id);
      return;
    });
    client.on("messageReactionRemove", async (reaction, user) => {
      if (client === null || reaction.message.id !== getRoleMessageId || reaction.message.channelId !== getRoleChannelId || reaction.emoji.name !== reactionEmoji || reaction.emoji.id !== null || user.bot || !ch4Guild.isOwnMessage(reaction.message)) {
        return;
      }
      ch4Guild.removeUserRole(user, ch4Guild.roles.explorer.id);
    });
    const collector = getRoleMessage.createReactionCollector({
      filter: (reaction, user) => reaction.emoji.name === reactionEmoji
    });
    collector.on("collect", (reaction, user) => {
      console.log(`${user.tag} \u6DFB\u52A0\u4E86\u53CD\u5E94 ${reaction.emoji.name}`);
    });
    collector.on("end", (collected) => {
      console.log(`\u6DFB\u52A0\u53CD\u5E94 ${reactionEmoji} \u7684\u603B\u4EBA\u6570\uFF1A${collected.size}`);
    });
  })();
  client.on("messageCreate", async (message) => {
    var _a2;
    if (message.author.bot) {
      return;
    }
    if (!ch4Guild.isOwnMessage(message)) {
      return;
    }
    const { content = "" } = message;
    const user = (_a2 = message.member) == null ? void 0 : _a2.user;
    if (!user) {
      return;
    }
    if (content.trim()) {
      ch4Guild.addRoleToUser(user, ch4Guild.roles.verified.id);
    }
    if (content.includes(`<@${CLIENT_ID}>`)) {
      const userId = `dc@${user.id}`;
      const conv = message.channelId;
      const replied = message.reply("Thinking...");
      const interval = setInterval(() => message.channel.sendTyping(), 3e3);
      replied.then(() => message.channel.sendTyping());
      message.reply(await askCurva(userId, conv, "gpt-web", message.content, 0));
      (await replied).delete();
      clearInterval(interval);
    }
  });
  client.on("guildMemberAdd", () => ch4UpdateMemberCount());
  client.on("guildMemberRemove", () => ch4UpdateMemberCount());
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
      return;
    switch (interaction.commandName) {
      case "yt-captions":
        handleInteractionForYTCaptions(interaction);
        break;
      case "gpt3":
        handleInteractionForCurvaAsk(interaction, "gpt3");
        break;
      case "gpt4":
        handleInteractionForCurvaAsk(interaction, "gpt4");
        break;
      case "gpt-web":
        handleInteractionForCurvaAsk(interaction, "gpt-web");
        break;
      case "clear-chatbot-memory":
        handleInteractionForCurvaClearHistory(interaction);
        break;
    }
  });
  await new Promise((resolve) => {
    const waitingUntil = Date.now() + 60 * 1e3;
    const interval = setInterval(() => {
      if (client === null || client.isReady() || waitingUntil < Date.now()) {
        clearInterval(interval);
        resolve(true);
      }
    }, 1);
  });
  console.log(`DC BOT conneted in ${Date.now() - t0} ms`);
  return;
}
if (+process.env.RUN_DC_BOT) {
  connect().then(() => {
  });
}
const bot = {
  get connected() {
    if (client === null) {
      return false;
    }
    return client.isReady();
  },
  connect,
  disconnect
};
const discordBot = bot;

export { discordBot as d };
//# sourceMappingURL=index.mjs.map
