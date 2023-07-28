import qs from 'qs'
import axios from 'axios'

async function getYouTubeCaptions (videoId: string, lang?: string) {
  const { data } = await axios.get(
    `https://youtube.com/watch?v=${videoId}`
  )
  const regex1 = /({"captionTracks":.*isTranslatable":(true|false)}])/
  const [match1] = regex1.exec(data) || []
  if (!match1) {
    throw new Error('Caption Tracks Not Found')
  }
  const captionTracks = JSON.parse(`${match1}}`).captionTracks as ({ baseUrl: string, name: { simpleText: string }, vssId: string, languageCode: string, isTranslatable: boolean })[]
  const { baseUrl } = captionTracks.filter((c) => c.languageCode === lang)[0] || captionTracks.filter((c) => c.isTranslatable)[0] || {}
  if (!baseUrl) {
    throw new Error('Language Not Supported')
  }
  const url = new URL(baseUrl)
  const apiOptions = qs.parse(url.search) as Record<string,string>
  apiOptions.fmt = 'json3'
  if (apiOptions.lang !== lang && lang) {
    const regex2 = /("translationLanguages":.*"defaultAudioTrackIndex":)/
    const [match2] = regex2.exec(data) || []
    if (!match2) {
      throw new Error('Caption Not Translatable')
    }
    const translationLanguages = JSON.parse(`{${match2}0}`).translationLanguages as ({ languageCode: string, languageName: { simpleText: string } })[]
    if (translationLanguages.map(l => l.languageCode.toLowerCase()).includes(lang.toLowerCase())) {
      apiOptions.tlang = lang
    } else {
      throw new Error('Language Not Supported')
    }
  }
  const captionsSourceUrl = `${url.origin}${url.pathname}${decodeURIComponent(qs.stringify(apiOptions))}`
  const captions = (await axios.get(captionsSourceUrl)).data?.events as ({ tStartMs: number, dDurationMs: number, segs: [{ utf8: string }] })[]
  if (!captions) {
    throw new Error('Captions Not Found')
  }
  return captions.map((caption) => ({ start: caption.tStartMs, dur: caption.dDurationMs, text: caption.segs[0].utf8 }))
}

export default defineEventHandler(async (event) => {
  const queries = qs.parse(event?.node?.req?.url?.split('?')[1] as string)
  const id = queries.id as string
  const lang = queries.lang as string
  const text = (await getYouTubeCaptions(id, lang)).map((caption) => caption.text).join('\n')
  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  return text
})
