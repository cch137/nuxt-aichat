const endSuffix = '\n-END-'

const endsWithSuffix = (text: string) => {
  return text.endsWith(endSuffix)
}

const addEndSuffix = (text: string) => {
  return `${text}${endSuffix}`
}

const removeEndSuffix = (text: string) => {
  if (endsWithSuffix(text)) {
    return text.substring(0, text.length - endSuffix.length)
  }
  return text
}

export {
  endsWithSuffix,
  addEndSuffix,
  removeEndSuffix
}
