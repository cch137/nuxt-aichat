export default function extractUrls(text: string, noRepeat = true) {
  const urlRegex = /((?:https?:\/\/)(?:www\.)?[a-zA-Z0-9\u4e00-\u9fa5-]+(?:\.[a-zA-Z0-9\u4e00-\u9fa5-]+)+(?:\/[^\s]*)?)/g
  const matches = text.match(urlRegex)
  if (matches) {
    const urls = matches.map((url) => {
      if (/^https?:\/\//i.test(url)) {
        return url
      }
      return `http://${url}`
    })
    return noRepeat ? [...new Set(urls)] : urls
  } else {
    return []
  }
}