export default async function (delayMs = 0) {
  return await new Promise((resolve, reject) => {
    if (process.client) {
      setTimeout(() => {
        try {
          window.scrollTo(0, document.body.scrollHeight)
          resolve(null)
        } catch (err) {
          reject(err)
        }
      }, +delayMs || 0)
    } else {
      resolve(null)
    }
  })
}
