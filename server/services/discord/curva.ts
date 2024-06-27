import type { ChatInputCommandInteraction, CacheType } from "discord.js";
import type { OpenAIMessage } from "~/server/services/chatbots/engines/cores/types";
import { EmbedBuilder } from "discord.js";
import str from "~/utils/str";
import curva, { Conversation } from "../chatbots/curva";
import { createTextFile } from "./utils";
import { getClientId } from "./clientId";

const askCurva = async (
  user: string,
  conv: string,
  model: string,
  messageContent: string,
  temperature = 0.5
) => {
  const question =
    messageContent.replaceAll(`<@${getClientId()}>`, "").trim() || "Hi";
  const messages = [
    ...(await new Conversation(user, conv).getContext()),
    { role: "user", content: question },
  ] as OpenAIMessage[];
  try {
    const response = await curva.ask(
      "discord",
      user,
      conv,
      model,
      temperature,
      messages,
      0
    );
    const { answer, error } = response;
    if (error) {
      throw error;
    }
    const queries = response?.queries || [];
    const urls = response?.urls || [];
    const embeds = (() => {
      if (queries.length + urls.length === 0) {
        return [];
      }
      const embed = new EmbedBuilder();
      embed.setColor("Blue");
      embed.setFields(
        ...[
          { name: "Queries", value: `${queries.join("\n")}` },
          { name: "Urls", value: `${urls.join("\n")}` },
        ].filter((l) => l.value)
      );
      return [embed];
    })();
    const files =
      answer.length > 1000 ? [createTextFile("answer.txt", answer)] : [];
    return { content: files.length === 0 ? answer : "", files, embeds };
  } catch (err) {
    console.log(err);
    return {
      content: "",
      embeds: [
        new EmbedBuilder()
          .setDescription(
            err === "THINKING"
              ? "Request denied. Please wait for the reply to the previous question to complete."
              : `ERROR: ${str(err)}`
          )
          .setColor("Red"),
      ],
    };
  }
};

const handleInteractionForCurvaAsk = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  model: string
) => {
  const message = (interaction.options.get("message")?.value || "") as string;
  const temperature = interaction.options.get("temperature")?.value as number;
  const dcUid = interaction.member?.user?.id || "";
  if (dcUid === "") {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "Direct messaging with the bot is currently not supported."
          )
          .setColor("Yellow"),
      ],
    });
    return;
  }
  const user = `dc@${dcUid}`;
  const conv = interaction.channelId;
  const replied = interaction.reply("Thinking...");
  const interval = setInterval(() => {
    try {
      interaction.channel!.sendTyping();
    } catch {}
  }, 3000);
  replied.then(() => {
    try {
      interaction.channel!.sendTyping();
    } catch {}
  });
  const {
    content,
    embeds = [],
    files = [],
  } = await askCurva(
    user,
    conv,
    model,
    message,
    temperature === undefined ? 0.5 : temperature
  );
  clearInterval(interval);
  const answered = await interaction.channel!.send({
    content: `<@${dcUid}> ${content
      .replaceAll("@everyone", "＠everyone")
      .replace(/<[@&]+(\d+)>/g, (match, group1) => `<${group1}>`)}`,
    embeds,
    files,
  });
  (await replied).edit({ content: answered?.url });
};

const handleInteractionForCurvaClearHistory = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const user = `dc@${interaction.member?.user.id}`;
  const conv = interaction.channelId;
  await new Conversation(user, conv).delete();
  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription(
          "Your conversation with the chatbot in this channel has been cleared."
        )
        .setColor("Green"),
    ],
  });
};

export {
  askCurva,
  handleInteractionForCurvaAsk,
  handleInteractionForCurvaClearHistory,
};
