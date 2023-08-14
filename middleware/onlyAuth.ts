export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const auth = useAuth()
    if (!(await auth.checkIsLoggedIn())) {
      setTimeout(() => useNuxtApp().$router.replace('/login'), 0)
    }
  }
})
