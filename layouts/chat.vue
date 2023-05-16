<template>
  <ClientOnly>
    <PageHeader />
  </ClientOnly>
  <slot />
  <ClientOnly>
    <InputBox />
  </ClientOnly>
</template>
