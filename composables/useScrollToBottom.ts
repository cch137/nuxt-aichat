export default async function () {
  return await new Promise((resolve, reject) => {
    if (process.client) {
      setTimeout(() => {
        try {
          window.scrollTo(0, document.body.scrollHeight)
          resolve(null)
        } catch (err) {
          reject(err)
        }
      })
    } else {
      resolve(null)
    }
  })
}
