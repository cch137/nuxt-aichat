<template>
  <div>
    <el-select
      v-model="webBrowsing"
    >
      <el-option :label="$t('settings.on')" value="ON" />
      <el-option :label="$t('settings.off')" value="OFF" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const allowedValues: any[] = ['ON', 'OFF']
const DEFAULT_VALUE = 'ON'
const name = 'web-browsing'
const cookie = useUniCookie()
const webBrowsing = useState(name, () => {
  const previousSetting = cookie.get(name)
  if (allowedValues.includes(previousSetting)) {
    return previousSetting
  } else {
    return DEFAULT_VALUE
  }
})
watch(webBrowsing, (newValue) => {
  if (typeof newValue === 'string') {
    cookie.set(name, newValue)
  }
})
</script>
