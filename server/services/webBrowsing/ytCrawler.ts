import qs from 'qs'
import axios from 'axios'

function parseVideoInfo (html: string) {
  const regex1 = /("playerMicroformatRenderer":.*}})(,"cards":)/
  const [_, match1] = regex1.exec(html) || []
  if (!match1) {
    return null
  }
  try {
    const data = JSON.parse(`{${match1}`).playerMicroformatRenderer
    return {
      title: data?.title?.simpleText as string | undefined,
      description: data?.description?.simpleText as string | undefined,
      thumbnail: data?.thumbnail?.thumbnails[0]?.url as string | undefined,
      category: data?.category as string | undefined,
      lengthSeconds: 'lengthSeconds' in data ? Number(data?.lengthSeconds) : undefined,
      viewCount: 'viewCount' in data ? Number(data?.viewCount) : undefined,
      publishDate: data?.publishDate as string | undefined,
      uploadDate: data?.uploadDate as string | undefined,
      ownerChannelName: data?.ownerChannelName as string | undefined,
      ownerProfileUrl: data?.ownerProfileUrl as string | undefined,
      externalChannelId: data?.externalChannelId as string | undefined,
      isUnlisted: 'externalChannelId' in data ? Boolean(data?.externalChannelId) : undefined,
    }
  } catch {
    return null
  }
}

async function getYouTubeCaptions (html: string, lang?: string, options = { ignoreNotSupportedLanguage: true }) {
  const regex1 = /({"captionTracks":.*isTranslatable":(true|false)}])/
  const [match1] = regex1.exec(html) || []
  if (!match1) {
    throw new Error('Caption Tracks Not Found')
  }
  const captionTracks = JSON.parse(`${match1}}`).captionTracks as ({ baseUrl: string, name: { simpleText: string }, vssId: string, languageCode: string, isTranslatable: boolean })[]
  const { baseUrl } = captionTracks.find((c) => c.languageCode === lang) || captionTracks.find((c) => c.isTranslatable) || {}
  if (!baseUrl) {
    throw new Error('Language Not Supported')
  }
  const url = new URL(baseUrl)
  const apiOptions = qs.parse(url.search) as Record<string,string>
  apiOptions.fmt = 'json3'
  if (apiOptions.lang !== lang && lang) {
    const regex3 = /("translationLanguages":.*"defaultAudioTrackIndex":)/
    const [match3] = regex3.exec(html) || []
    if (!match3) {
      throw new Error('Caption Not Translatable')
    }
    // const translationLanguages = JSON.parse(`{${match3}0}`).translationLanguages as ({ languageCode: string, languageName: { simpleText: string } })[]
    apiOptions.tlang = lang
  }
  const captionsSourceUrl = `${url.origin}${url.pathname}${decodeURIComponent(qs.stringify(apiOptions))}`
  const captions = (await axios.get(captionsSourceUrl, { validateStatus: (_) => true })).data?.events as ({ tStartMs: number, dDurationMs: number, segs: [{ utf8: string }] })[]
  if (!captions) {
    throw new Error('Captions Not Found')
  }
  return captions.map((caption) => ({ start: caption?.tStartMs, dur: caption?.dDurationMs, text: (caption?.segs || [])[0]?.utf8 || '' }))
}

async function crawlYouTubeVideo (videoId: string) {
  const url = `https://youtube.com/watch?v=${videoId}`
  const axiosResult = await axios.get(url, { validateStatus: (_) => true })
  return {
    get axios () { return axiosResult },
    get html () { return axiosResult.data },
    async getCaptions (lang?: string) {
      return getYouTubeCaptions(axiosResult.data, lang)
    },
    ...(parseVideoInfo(axiosResult.data) || {}),
    id: videoId,
    url,
  }
}

export { crawlYouTubeVideo }
