export default function extractUrls(text: string) {
  const urlRegex = /((?:https?:\/\/)(?:www\.)?[a-zA-Z0-9\u4e00-\u9fa5-]+(?:\.[a-zA-Z0-9\u4e00-\u9fa5-]+)+(?:\/[^\s]*)?)/g
  const matches = text.match(urlRegex)
  if (matches) {
    return matches.map((url) => {
      if (!/^(?:f|ht)tps?:\/\//i.test(url)) {
        url = 'http://' + url
      }
      return url
    })
  } else {
    return []
  }
}