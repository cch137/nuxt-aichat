<template>
  <main class="w-screen h-screen flex-center flex-col gap-8 select-none bg-black text-gray-400">
    <div
      class="text-6xl text-center"
      style="letter-spacing: 4px; line-height: 4rem;"
    >
      COMING SOON
    </div>
    <div class="cd text-4xl text-gray-600">
      {{ remaind }}
    </div>
    <div class="flex-center mt-16">
      <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
        <ElButton color="#424acf" size="large">
          <span class="text-lg">Join Our Discord</span>
        </ElButton>
      </a>
    </div>
  </main>
</template>

<script setup lang="ts">
import formatDate from "@cch137/utils/format/date"
const appName = useState('appName').value
const endDate = new Date(2024, 0, 21, 0, 0, 0, 0).getTime()
const remaind = ref('...');
setInterval(() => {
  const remaindDate = new Date(endDate - Date.now());
  const [dd, HH, mm, ss] = formatDate(remaindDate, 'dd:HH:mm:ss').split(':');
  remaind.value = `${dd}d ${HH}h ${mm}m ${ss}s`
}, 1000);
useTitle(`Coming Soon... | ${appName}`)
definePageMeta({
  layout: 'blank'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand&family=Roboto&display=swap');
main {
  font-family: 'Quicksand', sans-serif !important;
}
.cd {
  font-family: 'Roboto', sans-serif !important;
}
</style>
