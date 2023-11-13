import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import axios from 'axios'

async function handleInteractionForWikipediaArticle(interaction: ChatInputCommandInteraction<CacheType>) {
  const query = (interaction.options.get('query')?.value || '') as string
  const lang = (interaction.options.get('language-subdomain')?.value || '') as string
  interaction.reply((await axios.get(`https://api.cch137.link/wikipedia?a=${query}${lang ? `&l=${lang}` : ''}`)).data)
}

export {
  handleInteractionForWikipediaArticle
}