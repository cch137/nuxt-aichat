import type { TextBasedChannel } from 'discord.js'
import { Client, IntentsBitField } from 'discord.js'
import { askCurva, handleInteractionForCurvaAsk, handleInteractionForCurvaClearHistory } from './curva'
import { handleInteractionForYTCaptions } from './yt'
import CH4GuildCache from './CH4GuildCache'
import CLIENT_ID from './CLIENT_ID'

let client: Client<boolean> | null = null

async function disconnect () {
  const t0 = Date.now()
  if (client !== null) {
    const oldClient = client
    client = null
    try {
      await oldClient.destroy()
    } catch {}
  }
  console.log(`DC BOT disconneted in ${Date.now() - t0} ms`)
}

async function connect () {
  const t0 = Date.now()
  if (client !== null) {
    if (client.isReady()) {
      // IS CONNECTED!
      return
    }
    await disconnect()
  }

  client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions,
    ]
  })

  await client.login(process.env.DC_BOT_TOKEN)

  const ch4Guild = new CH4GuildCache(client, '730345526360539197', {
    botLogger: { id: '1113752420623851602' },
    totalMembers: { id: '1113758792430145547' }
  }, {
    verified: { id: '1106198793935917106' },
    ch4: { id: '1056465043279052833' },
    explorer: { id: '1133371837179506738' }
  })

  async function ch4UpdateMemberCount () {
    return await ch4Guild.updateMemberCount(ch4Guild.channels.totalMembers.id)
  }
  await ch4UpdateMemberCount()

  try {
    client.user?.setActivity({
      name: 'https://ch4.onrender.com',
      url: 'https://ch4.onrender.com',
      type: 0
    })
  } catch (err) {
    console.log('DCBOT setActivity Failed:', err)
  }

  (async () => {
    const reactionEmoji = '✨'
    const getRoleChannelId = '1138887783927263283'
    const getRoleMessageId = '1138889775487668224'
    const guild = await ch4Guild.getGuild()
    const getRoleMessage = await (await guild.channels.fetch(getRoleChannelId) as TextBasedChannel)
      .messages.fetch(getRoleMessageId)
    guild.channels.cache.clear()
    getRoleMessage.react(reactionEmoji)
    client.on('messageReactionAdd', async (reaction, user) => {
      if (client === null
        || reaction.message.id !== getRoleMessageId
        || reaction.message.channelId !== getRoleChannelId
        || reaction.emoji.name !== reactionEmoji
        || reaction.emoji.id !== null
        || user.bot
        || !ch4Guild.isOwnMessage(reaction.message)) {
        return
      }
      ch4Guild.addRoleToUser(user, ch4Guild.roles.explorer.id)
      return
    })
    client.on('messageReactionRemove', async (reaction, user) => {
      if (client === null
        || reaction.message.id !== getRoleMessageId
        || reaction.message.channelId !== getRoleChannelId
        || reaction.emoji.name !== reactionEmoji
        || reaction.emoji.id !== null
        || user.bot
        || !ch4Guild.isOwnMessage(reaction.message)) {
        return
      }
      ch4Guild.removeUserRole(user, ch4Guild.roles.explorer.id)
    })
    // 创建一个反应收集器
    const collector = getRoleMessage.createReactionCollector({
      filter: (reaction, user) => reaction.emoji.name === reactionEmoji,
    });
    // 监听 'collect' 事件
    collector.on('collect', (reaction, user) => {
      console.log(`${user.tag} 添加了反应 ${reaction.emoji.name}`);
    });
    // 监听 'end' 事件
    collector.on('end', collected => {
      console.log(`添加反应 ${reactionEmoji} 的总人数：${collected.size}`);
    });
  })()

  client.on('messageCreate', async (message) => {
    if (message.author.bot) {
      return
    }
    if (!ch4Guild.isOwnMessage(message)) {
      return
    }
    const { content = '' } = message
    const user = message.member?.user
    if (!user) {
      // NOT A USER
      return
    }
    // VERIFY USER
    if (content.trim()) {
      ch4Guild.addRoleToUser(user, ch4Guild.roles.verified.id)
    }
    // HANDLE PING MESSAGE
    if (content.includes(`<@${CLIENT_ID}>`)) {
      const userId = `dc@${user.id}`
      const conv = message.channelId
      const replied = message.reply('Thinking...')
      const interval = setInterval(() => message.channel.sendTyping(), 3000)
      replied.then(() => message.channel.sendTyping())
      message.reply(await askCurva(userId, conv, 'gpt-web', message.content, 0));
      (await replied).delete()
      clearInterval(interval)
    }
  })

  // TOTAL MEMBER
  client.on('guildMemberAdd', () => ch4UpdateMemberCount())
  client.on('guildMemberRemove', () => ch4UpdateMemberCount())

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    switch (interaction.commandName) {
      case 'yt-captions':
        handleInteractionForYTCaptions(interaction)
        break
      case 'gpt3':
        handleInteractionForCurvaAsk(interaction, 'gpt3')
        break
      case 'gpt4':
        handleInteractionForCurvaAsk(interaction, 'gpt4')
        break
      case 'gpt-web':
        handleInteractionForCurvaAsk(interaction, 'gpt-web')
        break
      case 'clear-chatbot-memory':
        handleInteractionForCurvaClearHistory(interaction)
        break
    }
  })

  await new Promise<boolean>((resolve) => {
    // WAITING FOR 60 secs
    const waitingUntil = Date.now() + 60 * 1000
    const interval = setInterval(() => {
      if (client === null || client.isReady() || waitingUntil < Date.now()) {
        clearInterval(interval)
        resolve(true)
      }
    }, 1)
  })
  console.log(`DC BOT conneted in ${Date.now() - t0} ms`)
  return
}

if (+(process.env.RUN_DC_BOT as string)) {
  connect()
    .then(() => {})
    // .then(async () => {
    //   await (store.client as Client<boolean>).application?.commands.create({
    //     name: 'yt-captions',
    //     description: 'Get subtitles for YouTube video.',
    //     options: [
    //       {
    //         name: 'id',
    //         description: 'Video link / id',
    //         type: ApplicationCommandOptionType.String,
    //         required: true
    //       },
    //       {
    //         name: 'language',
    //         description: 'language',
    //         type: ApplicationCommandOptionType.String,
    //         required: false
    //       },
    //     ]
    //   })
    // })
    // .then(() => {
    //   (store.client as Client<boolean>).application?.commands.create({
    //     name: 'chat',
    //     description: 'Chat with EvoGPT.',
    //     options: [
    //       {
    //         name: 'prompt',
    //         description: 'prompt',
    //         type: ApplicationCommandOptionType.String,
    //         required: true
    //       },
    //       {
    //         name: 'web-browsing',
    //         description: 'web-browsing',
    //         type: ApplicationCommandOptionType.String,
    //         choices: [
    //           {
    //             name: 'Off',
    //             value: 'OFF'
    //           },
    //           {
    //             name: 'Basic',
    //             value: 'BASIC'
    //           },
    //           {
    //             name: 'Advanced',
    //             value: 'ADVANCED'
    //           },
    //         ]
    //       },
    //       {
    //         name: 'temperature',
    //         description: 'temperature',
    //         type: ApplicationCommandOptionType.String,
    //         choices: [
    //           { name: '0', value: '_t00' },
    //           { name: '0.1', value: '_t01' },
    //           { name: '0.2', value: '_t02' },
    //           { name: '0.3', value: '_t03' },
    //           { name: '0.4', value: '_t04' },
    //           { name: '0.5', value: '_t05' },
    //           { name: '0.6', value: '_t06' },
    //           { name: '0.7', value: '_t07' },
    //           { name: '0.8', value: '_t08' },
    //           { name: '0.9', value: '_t09' },
    //           { name: '1.0', value: '_t10' },
    //         ]
    //       },
    //     ]
    //   })
    // })
}

const bot = {
  get connected () {
    if (client === null) {
      return false
    }
    return client.isReady()
  },
  connect,
  disconnect
}

export default bot
