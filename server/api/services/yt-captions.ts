import qs from "qs";
import { crawlYouTubeVideo } from "~/server/services/webBrowsing/ytCrawler";

export default defineEventHandler(async (event) => {
  const queries = qs.parse(event?.node?.req?.url?.split("?")[1] as string);
  const id = queries.id as string;
  const lang = queries.lang as string;
  event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  try {
    return (await (await crawlYouTubeVideo(id)).getCaptions(lang))
      .map((caption) => caption.text)
      .join("\n");
  } catch (err) {
    return `${err}`;
  }
});
