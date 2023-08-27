<template>
  <div class="mt-8 flex-col flex-center">
    <h1 class="welcome">{{ $t('chat.welcomeTo') }} {{ appName }}</h1>
    <div class="flex-center flex-wrap mt-16 gap-8">
      <NuxtLink to="/c/">
        <div class="card-outer">
          <div class="card-inner flex-center">
            {{ $t('page.aiChat') }}
          </div>
        </div>
      </NuxtLink>
      <NuxtLink to="/coder/">
        <div class="card-outer">
          <div class="card-inner flex-center">
            {{ $t('page.coder') }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const appName = useState('appName').value
useTitle(`Home - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.welcome {
  font-size: calc(1em * 3.25);
}
.card-outer {
  background: var(--el-fill-color-extra-light);
  height: 150px;
  width: 210px;
  cursor: pointer;
  border-radius: 16px;
  box-shadow: none;
  overflow: hidden;
  border: 4px solid var(--el-border-color-extra-light);
  transition: 0.5s cubic-bezier(0.23, 0.66, 0.62, 0.99);
}
.card-outer:hover {
  background: var(--el-fill-color-dark);
  box-shadow: var(--el-box-shadow);
  border: 4px solid var(--el-border-color-darker);
  transform: translateY(-8px);
}
.card-inner {
  width: 100%;
  height: 100%;
  font-size: calc(1em * 2);
}
html.light .card-inner {
  background: var(--el-color-primary-light-8);
}
</style>
