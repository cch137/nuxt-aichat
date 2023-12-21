import { AttachmentBuilder, codeBlock, EmbedBuilder, Client, IntentsBitField } from 'discord.js';
import { s as str } from './random.mjs';
import { C as Conversation, c as curva } from './index4.mjs';
import axios from 'axios';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';

const ytLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:\S+&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/g;
function extractYouTubeLinks(text) {
  const matches = text.match(ytLinkRegex);
  return matches ? matches.filter((link) => link.startsWith("https://") || link.startsWith("http://")) : [];
}
function isYouTubeLink(url) {
  return Boolean(extractYouTubeLinks(url).length > 0);
}
function getYouTubeVideoId(url) {
  const match = ytLinkRegex.exec(url);
  if (match !== null) {
    return match[1];
  }
  return null;
}

function createTextFile(filename, content) {
  return new AttachmentBuilder(Buffer.from(content, "utf8"), { name: filename });
}
function toCodeBlocks(input, maxLength = 1992) {
  const blocks = [];
  for (let i = 0; i < input.length; i += maxLength) {
    blocks.push(codeBlock(input.substring(i, i + maxLength)));
  }
  return blocks;
}

let clientId = "";
function getClientId() {
  return clientId;
}
function setClientId(value) {
  clientId = value;
}

const askCurva = async (user, conv, model, messageContent, temperature = 0.5) => {
  const question = messageContent.replaceAll(`<@${getClientId()}>`, "").trim() || "Hi";
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
  const dcUid = ((_d = (_c = interaction.member) == null ? void 0 : _c.user) == null ? void 0 : _d.id) || "";
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
  const answered = await interaction.channel.send({ content: `<@${dcUid}> ${content.replaceAll("@everyone", "\uFF20everyone").replace(/<[@&]+(\d+)>/g, (match, group1) => `<${group1}>`)}`, embeds, files });
  (await replied).edit({ content: answered == null ? void 0 : answered.url });
};
const handleInteractionForCurvaClearHistory = async (interaction) => {
  var _a;
  const user = `dc@${(_a = interaction.member) == null ? void 0 : _a.user.id}`;
  const conv = interaction.channelId;
  await new Conversation(user, conv).delete();
  interaction.reply({ embeds: [new EmbedBuilder().setDescription("Your conversation with the chatbot in this channel has been cleared.").setColor("Green")] });
};

async function handleInteractionForWikipediaArticle(interaction) {
  var _a, _b, _c;
  const query = ((_a = interaction.options.get("query")) == null ? void 0 : _a.value) || "";
  const lang = ((_b = interaction.options.get("language-subdomain")) == null ? void 0 : _b.value) || "";
  const blocks = toCodeBlocks((await axios.get(`https://api.cch137.link/wikipedia?a=${query}${lang ? `&l=${lang}` : ""}`)).data);
  await interaction.reply(blocks.shift());
  while (blocks.length)
    await ((_c = interaction.channel) == null ? void 0 : _c.send(blocks.shift()));
}

async function handleInteractionForYTCaptions(interaction) {
  var _a, _b;
  const videoLink = ((_a = interaction.options.get("id")) == null ? void 0 : _a.value) || "";
  const lang = ((_b = interaction.options.get("language")) == null ? void 0 : _b.value) || "";
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
  var _a, _b;
  const t0 = Date.now();
  if (client !== null) {
    if (client.isReady()) {
      return;
    }
    await disconnect();
  }
  client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds
    ]
  });
  setClientId(((_a = client.user) == null ? void 0 : _a.id) || "");
  await client.login(process.env.DC_BOT_TOKEN);
  try {
    (_b = client.user) == null ? void 0 : _b.setActivity({
      name: "https://ch4.us.to/",
      url: "https://ch4.us.to/",
      type: 0
    });
  } catch (err) {
    console.log("DCBOT setActivity Failed:", err);
  }
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
      case "wikipedia":
        handleInteractionForWikipediaArticle(interaction);
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
//# sourceMappingURL=index3.mjs.map
