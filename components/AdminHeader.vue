<template>
  <el-affix>
    <div class="PageHeader w-full px-4 gap-4 flex items-stretch">
      <div>
        <el-input v-model="key" placeholder="Secret"/>
      </div>
      <div>
        <el-button @click="buildTree">Go</el-button>
      </div>
    </div>
  </el-affix>
</template>

<script setup>
import { ElMessage } from 'element-plus'
const key = ref('')
const tree = useState('tree', () => [])
let fetching = false
const buildTree = () => {
  if (fetching) {
    return
  }
  fetching = true
  $fetch('/api/perspective/messages', {
    method: 'POST',
    body: {
      key: key.value
    }
  })
    .then((res) => {
      const _res = []
      for (const item of res) {
        const _conv = []
        for (const _c of item?.conv) {
          _conv.push(...[
            {
              label: `CONV: ${_c.conv}\n`,
              children: []
            },
            {
              label: `QUESTION: ${_c.Q}\n`,
              children: []
            },
            {
              label: `ANSWER: ${_c.A}\n`,
              children: []
            },
          ])
        }
        _res.push({ label: item?.user, children: _conv })
      }
      tree.value = _res
    })
    .catch(ElMessage.error)
    .finally(() => {
      fetching = false
    })
}
</script>

<style>
.PageHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.PageHeader > * {
  display: flex;
  align-items: center;
}
</style>
