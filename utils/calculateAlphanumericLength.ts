export default function calculateAlphanumericLength(text: string) {
  const regex = /[\p{L}\p{N}]/gu
  const matches = text.match(regex)
  const length = matches ? matches.length : 0
  return length
}
