import { defineEventHandler } from 'h3';
import { config } from 'dotenv';
import { Client, IntentsBitField } from 'discord.js';
import { c as createClient, b as createModel } from './mindsdb-sql.mjs';
import 'sequelize';

config();
const dcSequelize = createClient(
  process.env.DC_BOT_MDB_EMAIL_ADDRESS,
  process.env.DC_BOT_MDB_PASSWORD
);
createModel("gpt4_dc_bot", dcSequelize);
if (+process.env.RUN_DC_BOT) {
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent
    ]
  });
  client.login(process.env.DC_BOT_TOKEN).then(() => console.log("DC BOT Conneted."));
  client.on("messageCreate", (message) => {
    if (message.author.bot) {
      return;
    }
  });
} else {
  console.log("DC BOT closed.");
}
const discordBot = {};

const discord = defineEventHandler(async (event) => {
  return discordBot;
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
