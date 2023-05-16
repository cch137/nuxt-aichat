<template>
  <div class="flex-center gap-2">
    <el-text size="large" class="ModelSelectLabel">Model:</el-text>
    <el-select
      v-model="value"
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
const value = useState('model', () => 'gpt4')
const options = [
  {
    label: 'GPT-4',
    value: 'gpt4'
  },
  {
    label: 'GPT-3.5 Turbo',
    value: 'gpt3_5_turbo'
  }
]
</script>

<style scoped>
.ModelSelect {
  max-width: 10rem;
}
@media screen and (max-width: 500px) {
  .ModelSelect {
    max-width: 8rem;
  }
  .ModelSelectLabel {
    display: none;
  }
}
</style>
