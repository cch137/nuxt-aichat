<template>
  <AdminHeader />
  <div class="px-4 py-8">
    <ClientOnly>
      <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick" />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const handleNodeClick = (data: []) => {
  console.log(data)
}

const tree = useState('tree', () => [])

const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>

<style>
</style>
