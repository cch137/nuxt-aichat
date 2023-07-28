import { defineEventHandler } from 'h3';
import qs from 'qs';
import axios from 'axios';

async function getYouTubeCaptions(videoId, lang) {
  var _a;
  const { data } = await axios.get(
    `https://youtube.com/watch?v=${videoId}`
  );
  const regex1 = /({"captionTracks":.*isTranslatable":(true|false)}])/;
  const [match1] = regex1.exec(data) || [];
  if (!match1) {
    throw new Error("Caption Tracks Not Found");
  }
  const captionTracks = JSON.parse(`${match1}}`).captionTracks;
  const { baseUrl } = captionTracks.filter((c) => c.languageCode === lang)[0] || captionTracks.filter((c) => c.isTranslatable)[0] || {};
  if (!baseUrl) {
    throw new Error("Language Not Supported");
  }
  const url = new URL(baseUrl);
  const apiOptions = qs.parse(url.search);
  apiOptions.fmt = "json3";
  if (apiOptions.lang !== lang && lang) {
    const regex2 = /("translationLanguages":.*"defaultAudioTrackIndex":)/;
    const [match2] = regex2.exec(data) || [];
    if (!match2) {
      throw new Error("Caption Not Translatable");
    }
    const translationLanguages = JSON.parse(`{${match2}0}`).translationLanguages;
    if (translationLanguages.map((l) => l.languageCode.toLowerCase()).includes(lang.toLowerCase())) {
      apiOptions.tlang = lang;
    } else {
      throw new Error("Language Not Supported");
    }
  }
  const captionsSourceUrl = `${url.origin}${url.pathname}${decodeURIComponent(qs.stringify(apiOptions))}`;
  const captions = (_a = (await axios.get(captionsSourceUrl)).data) == null ? void 0 : _a.events;
  if (!captions) {
    throw new Error("Captions Not Found");
  }
  return captions.map((caption) => ({ start: caption.tStartMs, dur: caption.dDurationMs, text: caption.segs[0].utf8 }));
}
const ytCaptions = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const queries = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1]);
  const id = queries.id;
  const lang = queries.lang;
  const text = (await getYouTubeCaptions(id, lang)).map((caption) => caption.text).join("\n");
  event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return text;
});

export { ytCaptions as default };
//# sourceMappingURL=yt-captions.mjs.map
