export default function extractUrls(text: string) {
  const urlRegex = /((?:(?:https?|ftp):\/\/)?(?:www\.)?[^\s/$.?#]+\.[^\s]+)/g
  const matches = text.match(urlRegex)
  if (matches) {
    return matches.map(url => {
      if (!/^(?:f|ht)tps?:\/\//i.test(url)) {
        url = 'http://' + url
      }
      return url
    })
  } else {
    return []
  }
}
