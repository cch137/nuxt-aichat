export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.path.startsWith('/updating')) {
    return navigateTo('/updating');
  }
})
