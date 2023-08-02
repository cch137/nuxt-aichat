const copyToClipboard = (text: string) => new Promise((resolve, reject) => {
  navigator.clipboard.writeText(text)
    .then(_ => resolve(text))
    .catch(err => {
      try {
        const txArea = document.createElement('textarea')
        txArea.value = text
        document.body.appendChild(txArea)
        txArea.select()
        document.execCommand('copy')
        txArea.remove()
        resolve(text)
      } catch (er) {
        reject([err, er])
      }
    })
})

const getScrollTop = () => {
  return Math.ceil(document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight
}

const isScrolledToBottom = (errorValue = 2) => {
  return getScrollTop() >= document.documentElement.scrollHeight - errorValue
}

export {
  getScrollTop,
  copyToClipboard,
  isScrolledToBottom
}
