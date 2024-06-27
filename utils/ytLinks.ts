const ytLinkRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:\S+&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/g;

function extractYouTubeLinks(text: string) {
  const matches = text.match(ytLinkRegex);
  return matches
    ? matches.filter(
        (link) => link.startsWith("https://") || link.startsWith("http://")
      )
    : [];
}

function isYouTubeLink(url: string) {
  return Boolean(extractYouTubeLinks(url).length > 0);
}

function getYouTubeVideoId(url: string) {
  const match = ytLinkRegex.exec(url);
  if (match !== null) {
    return match[1];
  }
  return null;
}

export { extractYouTubeLinks, isYouTubeLink, getYouTubeVideoId };
