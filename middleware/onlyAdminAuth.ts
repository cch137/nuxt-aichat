export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const isLoggedIn = await useAdmin().checkIsLoggedIn()
    if (!isLoggedIn) {
      return await navigateTo('/admin/login')
    }
  }
})
