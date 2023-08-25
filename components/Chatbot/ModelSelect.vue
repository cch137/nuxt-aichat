<template>
  <div>
    <el-select
      v-model="model"
      placeholder="Select model"
      class="ChatbotModelSelect"
    >
      <el-option
        v-for="model in models"
        :key="model.name"
        :label="model.name"
        :value="model.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const { model, models } = useChat()
</script>
