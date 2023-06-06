<template>
  <div>
    <el-input-number
      v-model="temperature"
      :min="0"
      :max="1"
      :step="0.1"
      style="width: 96%;"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
const { temperatureSuffix } = useChat()
const temperature = ref(+temperatureSuffix.value.substring(2) / 10)
watch(temperatureSuffix, (value) => {
  const newTemp = +temperatureSuffix.value.substring(2) / 10
  if (temperature.value != newTemp) {
    temperature.value = newTemp
  }
})
const handleChange = (value = 0.5) => {
  const temp = Math.round(value * 10) / 10
  temperature.value = temp
  // @ts-ignore
  temperatureSuffix.value = `_t${(temp * 10).toString().padStart(2, '0')}`
}
</script>
