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
      <div class="pb-16">
        <details v-for="chap in lsTree">
          <summary class="chapter-title">{{ chap.chapter }}</summary>
          <div class="flex flex-wrap gap-2 pl-4 pt-2 pb-4">
            <el-link v-for="prob in chap.problems" :href="prob.link" target="_blank">
              {{ prob.p }}
            </el-link>
          </div>
        </details>
      </div>
      <div class="flex-center pb-16">
        <el-link @click="back()">BACK</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import random from '~/utils/random'

const selectedFilename = ref('')
const lsList = ref<string[]>([])
const lsTree = ref<{chapter:string,problems:{p:string,link:string}[]}[]>([])

function back() {
  if (history.length > 1) {
    history.back()
  } else {
    ElMessage.info(random.choice([
      'Oh~dear, you shouldn\'t click this.',
      'Back? Where do you want to go?',
      'I don\'t want you to go anywhere else.',
      'Stay here!',
      'You are lost.',
    ]))
  }
}

async function fetchList() {
  const res = await fetch('https://api.cch137.link/ls/list')
  lsList.value = (await res.json()) as string[]
}

async function fetchTree() {
  const tree: {chapter: string, problems: {p:string,link:string}[]}[] = [];
  lsTree.value = [];
  const loading = useElLoading();
  const res = await(await fetch(`https://api.cch137.link/ls/${selectedFilename.value}`)).json() as {isbn_c_p:string,link:string}[]
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
  loading.close();
}

if (process.client) {
  const loading = useElLoading();
  fetchList()
    .then(() => {
      loading.close();
      const q = useURLParams().get('q') || '';
      if (!q) return;
      for (const book of lsList.value) {
        console.log(book.toLowerCase(), q.toLowerCase());
        if (book.toLowerCase().includes(q.toLowerCase())) {
          selectedFilename.value = book;
          fetchTree();
          break;
        }
      }
    })
}

const appName = useState('appName')
useTitle(`LS - ${appName.value}`)
definePageMeta({
  layout: 'blank'
})
</script>

<style scoped>
.chapter-title:hover {
  background: #ffffff10;
  transition: .3s ease-in-out;
  cursor: pointer;
}
</style>
