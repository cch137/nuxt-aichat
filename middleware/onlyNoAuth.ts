export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const auth = useAuth()
    if (await auth.checkIsLoggedIn()) {
      auth.goToNewChat()
    }
  }
})
