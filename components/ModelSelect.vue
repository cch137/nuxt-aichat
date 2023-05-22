<template>
  <div>
    <el-select
      v-model="model"
      placeholder="Select model"
      class="ModelSelect"
      style="width: 96%;"
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
const model = useState('model', () => 'gpt4')
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
