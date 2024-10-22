import qs from 'qs';
import axios from 'axios';

function parseVideoInfo(html) {
  var _a, _b, _c, _d;
  const regex1 = /("playerMicroformatRenderer":.*}})(,"cards":)/;
  const [_, match1] = regex1.exec(html) || [];
  if (!match1) {
    return null;
  }
  try {
    const data = JSON.parse(`{${match1}`).playerMicroformatRenderer;
    return {
      title: (_a = data == null ? void 0 : data.title) == null ? void 0 : _a.simpleText,
      description: (_b = data == null ? void 0 : data.description) == null ? void 0 : _b.simpleText,
      thumbnail: (_d = (_c = data == null ? void 0 : data.thumbnail) == null ? void 0 : _c.thumbnails[0]) == null ? void 0 : _d.url,
      category: data == null ? void 0 : data.category,
      lengthSeconds: "lengthSeconds" in data ? Number(data == null ? void 0 : data.lengthSeconds) : void 0,
      viewCount: "viewCount" in data ? Number(data == null ? void 0 : data.viewCount) : void 0,
      publishDate: data == null ? void 0 : data.publishDate,
      uploadDate: data == null ? void 0 : data.uploadDate,
      ownerChannelName: data == null ? void 0 : data.ownerChannelName,
      ownerProfileUrl: data == null ? void 0 : data.ownerProfileUrl,
      externalChannelId: data == null ? void 0 : data.externalChannelId,
      isUnlisted: "externalChannelId" in data ? Boolean(data == null ? void 0 : data.externalChannelId) : void 0
    };
  } catch {
    return null;
  }
}
async function getYouTubeCaptions(html, lang, options = { ignoreNotSupportedLanguage: true }) {
  var _a;
  const regex1 = /({"captionTracks":.*isTranslatable":(true|false)}])/;
  const [match1] = regex1.exec(html) || [];
  if (!match1) {
    throw new Error("Caption Tracks Not Found");
  }
  const captionTracks = JSON.parse(`${match1}}`).captionTracks;
  const { baseUrl } = captionTracks.find((c) => c.languageCode === lang) || captionTracks.find((c) => c.isTranslatable) || {};
  if (!baseUrl) {
    throw new Error("Language Not Supported");
  }
  const url = new URL(baseUrl);
  const apiOptions = qs.parse(url.search);
  apiOptions.fmt = "json3";
  if (apiOptions.lang !== lang && lang) {
    const regex3 = /("translationLanguages":.*"defaultAudioTrackIndex":)/;
    const [match3] = regex3.exec(html) || [];
    if (!match3) {
      throw new Error("Caption Not Translatable");
    }
    apiOptions.tlang = lang;
  }
  const captionsSourceUrl = `${url.origin}${url.pathname}${decodeURIComponent(qs.stringify(apiOptions))}`;
  const captions = (_a = (await axios.get(captionsSourceUrl, { validateStatus: (_) => true })).data) == null ? void 0 : _a.events;
  if (!captions) {
    throw new Error("Captions Not Found");
  }
  return captions.map((caption) => {
    var _a2;
    return { start: caption == null ? void 0 : caption.tStartMs, dur: caption == null ? void 0 : caption.dDurationMs, text: ((_a2 = ((caption == null ? void 0 : caption.segs) || [])[0]) == null ? void 0 : _a2.utf8) || "" };
  });
}
async function crawlYouTubeVideo(videoId) {
  const url = `https://youtube.com/watch?v=${videoId}`;
  const axiosResult = await axios.get(url, { validateStatus: (_) => true });
  return {
    get axios() {
      return axiosResult;
    },
    get html() {
      return axiosResult.data;
    },
    async getCaptions(lang) {
      return getYouTubeCaptions(axiosResult.data, lang);
    },
    ...parseVideoInfo(axiosResult.data) || {},
    id: videoId,
    url
  };
}

export { crawlYouTubeVideo as c };
//# sourceMappingURL=ytCrawler.mjs.map
