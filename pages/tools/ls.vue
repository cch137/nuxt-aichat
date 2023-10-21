<template>
  <div class="mt-8 flex-col gap-4 flex-center">
    <ClientOnly>
      <h1 class="m-0">LS</h1>
      <div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center">
        <el-select
          v-model="selectedFilename"
          @change="fetchTree()"
          placeholder="請選擇原文書"
          :loading="isFetchingTree"
        >
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
        <div v-if="lsTree.length" class="flex-col flex-center pb-16">
          <div>
            <el-text type="info">提示：點擊下載 (Скачать) 可以取得更清晰的圖片。免責聲明：本站非以上文件之所有者，訪客若因訪問非本站頁面或資源導致任何損失，本站概不負責。</el-text>
          </div>
        </div>
        <div class="flex-center pb-16">
          <el-link @click="back()">BACK</el-link>
        </div>
      </div>
    </ClientOnly>
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

const isFetchingTree = ref(false)

async function fetchTree() {
  isFetchingTree.value = true
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
  isFetchingTree.value = false
}

if (process.client) {
  (async () => {
    const q = useURLParams().get('q') || '';
    const req = fetch('https://api.cch137.link/ls/list');
    lsList.value = await (await req).json() as string[]
    if (q && !selectedFilename.value) {
      for (const book of lsList.value) {
        if (book.toLowerCase().includes(q.toLowerCase())) {
          selectedFilename.value = book;
          await fetchTree();
          break;
        }
      }
    }
  })();
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
