export default function () {
  if (process.client) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
}
