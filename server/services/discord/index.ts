import type { TextBasedChannel } from 'discord.js'
import { Client, IntentsBitField, ApplicationCommandOptionType } from 'discord.js'
import { handleInteractionForCurvaAsk, handleInteractionForCurvaClearHistory } from './curva'
import { handleInteractionForWikipediaArticle } from './wikipedia'
import { handleInteractionForYTCaptions } from './yt'
import { setClientId } from './clientId'

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
    ]
  })

  setClientId(client.user?.id || '')

  await client.login(process.env.DC_BOT_TOKEN)

  try {
    client.user?.setActivity({
      name: 'https://ch4.us.to/',
      url: 'https://ch4.us.to/',
      type: 0
    })
  } catch (err) {
    console.log('DCBOT setActivity Failed:', err)
  }

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
      case 'wikipedia':
        handleInteractionForWikipediaArticle(interaction)
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
    //   (client as Client<boolean>).application?.commands.create({
    //     name: 'wikipedia',
    //     description: 'Fetch excerpts of wikipedia articles.',
    //     options: [
    //       {
    //         name: 'query',
    //         description: 'Article title',
    //         type: ApplicationCommandOptionType.String,
    //         required: true
    //       },
    //       {
    //         name: 'language-subdomain',
    //         description: 'If not specified, the language subdomain will be automatically detected.',
    //         type: ApplicationCommandOptionType.String,
    //         required: false
    //       },
    //     ]
    //   })
    // })
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
    //     description: 'Chat with Curva.',
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
