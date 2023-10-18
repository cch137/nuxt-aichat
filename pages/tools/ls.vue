<template>
  <div class="mt-8 flex-col gap-4 flex-center">
    <h1 class="m-0">LS</h1>
    <div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center">
      <el-select v-model="selectedFilename" @change="fetchTree()">
        <el-option
          v-for="item in lsList"
          :key="item"
          :label="item.replaceAll('.json', '')"
          :value="item"
        />
      </el-select>
      <div class="pb-20">
        <details v-for="chap in lsTree">
          <summary class="chapter-title">{{ chap.chapter }}</summary>
          <div class="flex flex-wrap gap-2 pl-4 pt-2 pb-4">
            <el-link v-for="prob in chap.problems" :href="prob.link" target="_blank">
              {{ prob.p }}
            </el-link>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedFilename = ref('')
const lsList = ref<string[]>([])
const lsTree = ref<{chapter:string,problems:{p:string,link:string}[]}[]>([])

async function fetchList() {
  const res = await fetch('https://api.cch137.link/ls/list')
  lsList.value = (await res.json()) as string[]
}

async function fetchTree() {
  const tree: {chapter: string, problems: {p:string,link:string}[]}[] = [];
  const res = await (await fetch(`https://api.cch137.link/ls/${selectedFilename.value}`)).json() as {isbn_c_p:string,link:string}[]
  function getChapterProblems(chapter: string) {
    for (const chap of tree) {
      if (chap.chapter === chapter) {
        return chap.problems;
      }
    }
    const problems: {p:string,link:string}[] = [];
    tree.push({ chapter, problems });
    return problems;
  }
  for (const item of res) {
    const [_, chapter, problem] = item.isbn_c_p.split('_');
    getChapterProblems(chapter).push({ p: problem, link: item.link })
  }
  lsTree.value = tree;
}

if (process.client) {
  fetchList()
}

// @ts-ignore
const _t = useLocale().t
const appName = useState('appName').value
useTitle(`${_t('page.currencyCvt')} - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.chapter-title:hover {
  background: #ffffff10;
  transition: .3s ease-in-out;
  cursor: pointer;
}
</style>
