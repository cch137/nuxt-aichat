export default function (title: string) {
  useHead({
    title,
    meta: [
      { property: 'og:title', content: title },
      { property: 'twitter:title', content: title },
    ]
  })
}
