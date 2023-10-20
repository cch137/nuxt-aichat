<template>
  <div class="mt-8 flex-col gap-4 flex-center">
    <h1 class="m-0">Determinant</h1>
    <div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center">
      <el-input-number v-model="matrixSize" @change="determinantOnchange()" />
      <div>
        <div v-for="r in range(matrixSize)">
          <el-input
            v-for="c in range(matrixSize)"
            v-model="matrix[r][c]"
            style="max-width:45px;"
            @keyup="determinantOnchange()"
            :formatter="(v: string) => trimValue(v)"
            :parser="(v: string) => trimValue(v)"
          />
        </div>
      </div>
      <div>
        <div>Determinant: {{ determinant }}</div>
      </div>
      <div class="pb-16"></div>
      <div class="flex-center pb-16">
        <el-link @click="back()">BACK</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function trimValue(value: string) {
  return value.replace(/\s/g, '')
}

const matrixSize = ref<number>(0);
const matrix = reactive<number[][]>([])

function range(n: number) {
  const result = []
  for (let i = 0; i < n; i++) result.push(i)
  return result
}

function back() {
  if (history.length > 1) {
    history.back()
  } else {
    useNuxtApp().$router.push('/')
  }
}

function initDeterminant() {
  while (matrix.length != matrixSize.value) {
    if (matrix.length > matrixSize.value) {
      matrix.pop()
      for (let i = 0; i < matrix.length; i++) if (matrix[i].length > matrixSize.value) matrix[i].pop()
    } else {
      matrix.push(Array.from({ length: matrixSize.value }).fill(0) as number[])
      for (let i = 0; i < matrix.length; i++) if (matrix[i].length < matrixSize.value) matrix[i].push(0)
    }
  }
}

const determinant = ref<number>(0)

function calcDeterminant(matrix: number[][]): number {
  if (matrix.length == 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  let sum: number = 0
  for (let i = 0; i < matrix.length; i++) {
    const coefficient = matrix[0][i]
    if (coefficient == 0) continue;
    const selected_matrix: number[][] = []
    for (let row = 1; row < matrix.length; row++) {
      const selected_row: number[] = []
      for (let col = 0; col < matrix.length; col++) {
        if (col != i) selected_row.push(matrix[row][col])
      }
      selected_matrix.push(selected_row)
    }
    sum += coefficient * calcDeterminant(selected_matrix) * (i % 2 == 0 ? 1 : -1)
  }
  return sum
}

function determinantOnchange() {
  initDeterminant()
  determinant.value = calcDeterminant(matrix)
}

if (process.client) {
  matrixSize.value = 3
  determinantOnchange()
}

const appName = useState('appName')
useTitle(`Matrix Calculator - ${appName.value}`)
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
