<template>
  <ClientOnly>
    <PageHeader />
  </ClientOnly>
  <div style="padding-top: 56px;">
    <slot />
    <ClientOnly>
      <InputBox />
      <PageDrawer />
    </ClientOnly>
  </div>
</template>
