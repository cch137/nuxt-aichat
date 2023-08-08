<template>
  <div>
    <el-select
      v-model="model"
      placeholder="Select model"
      class="ChatbotModelSelect"
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
    label: 'GPT-3.5',
    value: 'gpt3'
  },
  {
    label: 'GPT-4',
    value: 'gpt4'
  },
  {
    label: 'GPT-Web',
    value: 'gpt-web'
  },
  {
    label: 'Claude-2-Web',
    value: 'claude-2-web'
  },
  {
    label: 'GPT3.5-FGA',
    value: 'gpt3-fga'
  },
]
</script>
