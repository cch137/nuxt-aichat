<template>
  <ClientOnly>
    <el-select
      v-model="i18n.locale"
      placeholder="Select"
      @change="(value) => i18n.locale = value"
     
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </ClientOnly>
</template>

<script setup>
const i18n = useLocale()

const options = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: '繁體中文',
    value: 'zh-TW'
  }
]
</script>
