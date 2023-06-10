<template>
  <div>
    <el-select
      v-model="model"
      placeholder="Select model"
      class="ModelSelect"
     
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const { model } = useChat()
const options = [
  {
    label: 'GPT-4',
    value: 'gpt4'
  },
  {
    label: 'dev-mode',
    value: 'gpt3'
  }
]
</script>
