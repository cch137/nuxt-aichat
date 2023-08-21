export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const admin = useAdmin()
    if (!(await admin.checkIsLoggedIn())) {
      setTimeout(() => useNuxtApp().$router.replace('/admin/login'), 0)
    }
  }
})
