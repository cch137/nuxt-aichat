<template>
  <div class="mt-8 flex-col gap-4 flex-center">
    <h1>{{ $t('page.currencyCvt') }}</h1>
    <div class="px-4 w-full max-w-prose flex flex-col gap-4 justify-center">
      <div class="flex gap-4">
        <el-select v-model="fxFromCurrency" class="currency-select" size="large">
          <el-option v-for="item in availableCurrencies" :key="item" :label="item" :value="item" />
        </el-select>
        <div class="flex-1 flex-center">
          <el-input v-model="fxFromValue" type="number" size="large" class="FxFromValueInput currency-input" @keyup="calcToValue()" @change="calcToValue(true)" />
        </div>
      </div>
      <div class="flex gap-4">
        <el-select v-model="fxToCurrency" class="currency-select" size="large">
          <el-option v-for="item in availableCurrencies" :key="item" :label="item" :value="item" />
        </el-select>
        <div class="flex-1 flex-center">
          <el-input v-model="fxToValue" type="number" size="large" class="FxFromValueOutput currency-input" @keyup="calcFromValue()" @change="calcFromValue(true)" />
        </div>
      </div>
      <div class="flex-center">
        <el-button class="SwitchCurrenciesButton" @click="switchCurrencies()" :icon="Switch" size="large" />
      </div>
    </div>
    <div class="qrcode-canvas-outter flex-center flex-wrap p-4 w-full">
      <canvas ref="qrcodeCanvas" id="qrcode-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@element-plus/icons-vue'

const availableCurrencies = ref<string[]>([])
const fxFromCurrency = ref('TWD')
const fxToCurrency = ref('MYR')
// @ts-ignore
const fxFromValue: globalThis.Ref<number> = ref('')
// @ts-ignore
const fxToValue: globalThis.Ref<number> = ref('')

async function _fetchCurrency(fromCurrency: string, toCurrency: string) {
  if (fromCurrency === toCurrency) return 1
  const res = await fetch(`https://api.cch137.link/currency?from=${fromCurrency}&to=${toCurrency}`)
  const fxRate = (await res.json())?.rate || 0
  return fxRate
}

const getFxRate = (() => {
  let lastFetchFromCurrency = ''
  let lastFetchToCurrency = ''
  let mustUpdateAfter = 0
  let fetchPromise: Promise<number> | undefined = undefined
  return async () => {
    const fromCurrency = fxFromCurrency.value
    const toCurrency = fxToCurrency.value
    if (mustUpdateAfter < Date.now() || lastFetchFromCurrency !== fromCurrency || lastFetchToCurrency !== toCurrency) {
      fetchPromise = _fetchCurrency(fromCurrency, toCurrency)
      lastFetchFromCurrency = fromCurrency
      lastFetchToCurrency = toCurrency
      if (process.client) {
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('from', fromCurrency)
        urlParams.set('to', toCurrency)
        history.replaceState(0, '', `${location.pathname}?${urlParams.toString()}`)
      }
      mustUpdateAfter = Date.now() + 5 * 60 * 1000
    }
    return await fetchPromise || 1
  }
})();

function roundTo2Digits(amount: number, add00 = true): number {
  const ans = Math.round(amount * 100) / 100
  if (add00 && ans % 1 === 0) {
    // @ts-ignore
    return `${ans}.00`
  }
  if (!add00 && !ans) {
    // @ts-ignore
    return ''
  }
  return ans
}

async function calcToValue(selfUpdate = false) {
  fxToValue.value = roundTo2Digits(fxFromValue.value * await getFxRate())
  if (selfUpdate) {
    fxFromValue.value = roundTo2Digits(fxFromValue.value, false)
  }
}

async function calcFromValue(selfUpdate = false) {
  if (selfUpdate) {
    fxToValue.value = roundTo2Digits(fxToValue.value)
  }
  fxFromValue.value = roundTo2Digits(fxToValue.value / await getFxRate(), false)
}

function focusFxFromValueInput() {
  try {
    (document.querySelector('.FxFromValueInput input') as HTMLInputElement).focus()
  } catch {}
}

function switchCurrencies() {
  const temp = fxFromCurrency.value
  fxFromCurrency.value = fxToCurrency.value
  fxToCurrency.value = temp
}

async function updateAvailableCurrencies() {
  const res = await fetch('https://api.cch137.link/currency-list')
  availableCurrencies.value = (await res.json()) as string[]
}

if (process.client) {
  watch(fxFromCurrency, () => calcToValue())
  watch(fxToCurrency, () => calcToValue())
  const urlParams = new URLSearchParams(location.search)
  const fromCurrency = urlParams.get('from') || 'TWD'
  const toCurrency = urlParams.get('to') || 'MYR'
  fxFromCurrency.value = fromCurrency
  fxToCurrency.value = toCurrency
  updateAvailableCurrencies()
  calcToValue()
  onMounted(focusFxFromValueInput)
}

// @ts-ignore
const _t = useLocale().t
const appName = useState('appName').value
useTitle(`${_t('page.currencyCvt')} - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>

<style>
.currency-select {
  width: 100px;
}
.currency-select * {
  font-size: 1.25rem;
}
.currency-input, .currency-select * {
  height: 64px;
}
.currency-input input {
  height: 100%;
  font-size: 1.5rem;
}
.SwitchCurrenciesButton {
  padding: 14px !important;
}
.SwitchCurrenciesButton i {
  transform: scale(1.25);
}
</style>
