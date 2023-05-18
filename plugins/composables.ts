export default defineNuxtPlugin(() => {
  return {
    provide: {
      // @ts-ignore
      t: useLocale().t
    }
  }
})
