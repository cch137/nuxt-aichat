export default function () {
  if (process.client) {
    window.scrollTo(0, document.body.scrollHeight)
  }
}
