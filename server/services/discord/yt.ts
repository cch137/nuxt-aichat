import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { crawlYouTubeVideo } from '~/server/services/webBrowsing/ytCrawler'
import { isYouTubeLink, getYouTubeVideoId } from '~/utils/ytLinks'
import str from '~/utils/str'
import { createTextFile } from './utils'

async function handleInteractionForYTCaptions (interaction: ChatInputCommandInteraction<CacheType>) {
  const videoLink = (interaction.options.get('id')?.value || '') as string
  const lang = (interaction.options.get('lang')?.value || '') as string
  const videoId: string = isYouTubeLink(videoLink) 
    ? getYouTubeVideoId(videoLink) || ''
    : videoLink;
    if (!videoId) {
      interaction.reply('Error: Illegal Video ID')
      return
    }
  const replied = interaction.reply('Processing...')
  try {
    const video = await crawlYouTubeVideo(videoId)
    const captions = (await video.getCaptions(lang)).map((caption) => caption.text).join('\n')
    const textFile = createTextFile(`${video.title}.txt`, captions);
    (await replied).edit({ content: video.url, files: [textFile] })
  } catch (err) {
    (await replied).edit(str(err))
  }
}

export {
  handleInteractionForYTCaptions
}
