<template>
  <ClientOnly>
    <DefaultHeader />
  </ClientOnly>
  <div style="padding-top: 56px;" class="w-full">
    <slot />
    <div class="cf-turnstile" data-sitekey="0x4AAAAAAAJN-U47BDF4fe0B" data-callback="javascriptCallback" />
  </div>
</template>
