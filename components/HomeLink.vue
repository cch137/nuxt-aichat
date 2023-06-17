<template>
  <NuxtLink
    to="/"
    class="text-2xl font-medium"
    style="transition: .3s;"
  >
    <div class="flex-center">
      <CurvaLogoSvg class="pointer-events-none" style="height: 32px; margin-right: 8px;" src="~/assets/svg/Curva.svg" />
      <div>{{ appName }}</div>
    </div>
  </NuxtLink>
</template>

<script setup>
const appName = useState('appName')
</script>