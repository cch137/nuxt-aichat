<template>
  <div>
    <el-input-number style="width: 100%;" v-model="temperature" :min="0" :max="1" :step="0.1" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
const temperature = ref(0.5)
const { temperatureSuffix } = useChat()
const handleChange = (value: number) => {
  const temp = Math.round(value * 10) / 10
  temperature.value = temp
  // @ts-ignore
  temperatureSuffix.value = `_${(temp * 10).toString().padStart(2, '0')}`
}
</script>
