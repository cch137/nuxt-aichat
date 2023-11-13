import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import axios from 'axios'
import { toCodeBlocks } from './utils'

async function handleInteractionForWikipediaArticle(interaction: ChatInputCommandInteraction<CacheType>) {
  const query = (interaction.options.get('query')?.value || '') as string
  const lang = (interaction.options.get('language-subdomain')?.value || '') as string
  const blocks = toCodeBlocks((await axios.get(`https://api.cch137.link/wikipedia?a=${query}${lang ? `&l=${lang}` : ''}`)).data)
  await interaction.reply(blocks.shift() as string)
  while (blocks.length) await interaction.channel?.send(blocks.shift() as string)
}

export {
  handleInteractionForWikipediaArticle
}