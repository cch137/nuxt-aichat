<template>
  <ClientOnly>
    <PageHeader />
  </ClientOnly>
  <slot />
  <ClientOnly>
    <InputBox />
    <PageDrawer />
  </ClientOnly>
</template>
