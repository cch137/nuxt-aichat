<template>
  <div class="mt-8 flex-col gap-4 flex-center">
    <h1>{{ $t('page.qrCode') }}</h1>
    <div class="px-4 w-full flex justify-center">
      <el-input
        v-model="qrCodeInput"
        class="QRCodeInput"
        type="textarea"
        :autofocus="true"
        :autosize="{ minRows: 2, maxRows: 8 }"
      />
    </div>
    <div class="qrcode-canvas-outter flex-center flex-wrap p-4 w-full">
      <canvas ref="qrcodeCanvas" id="qrcode-canvas"></canvas>
    </div>
    <div class="mb-32">
      <el-button @click="downloadCanvasPng()">{{ $t('action.download') }} PNG</el-button>
      <el-button @click="downloadCanvasJpg()">{{ $t('action.download') }} JPG</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import qrcode from 'qrcode'

const qrCodeInput = ref('Hello World!')

function focusTextarea() {
  try {
    (document.querySelector('.QRCodeInput textarea') as HTMLTextAreaElement).focus()
  } catch {}
}

function getCanvasEl() {
  return document.getElementById('qrcode-canvas') as HTMLCanvasElement
}

function generateQRCode() {
  const qrcodeCanvas = getCanvasEl()
  qrcode.toCanvas(qrcodeCanvas, qrCodeInput.value, (err) => {
    if (err) {
      ElMessage.error(`${err.name}: ${err.message}`)
    }
    qrcodeCanvas.style.height = `${qrcodeCanvas.clientWidth}px`
    focusTextarea()
  })
}

function downloadCanvas(format = 'png', suffix = 'png') {
  const qrcodeCanvas = getCanvasEl()
  const downloadLink = document.createElement('a')
  const canvasDataURL = qrcodeCanvas.toDataURL(`image/${format}`)
  downloadLink.href = canvasDataURL
  downloadLink.download = `${qrCodeInput.value.substring(0, 256)}.${suffix}`
  downloadLink.click()
  focusTextarea()
}

function downloadCanvasPng() {
  return downloadCanvas('png', 'png')
}

function downloadCanvasJpg() {
  return downloadCanvas('jpeg', 'jpg')
}

if (process.client) {
  watch(qrCodeInput, () => generateQRCode())
  window.addEventListener('resize', () => generateQRCode())
  qrCodeInput.value = location.origin
  onMounted(() => setTimeout(() => generateQRCode(), 100))
}

// @ts-ignore
const _t = useLocale().t
const appName = useState('appName').value
useTitle(`${_t('page.qrCode')} - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>

<style>
.qrcode-canvas-outter {
  max-width: 100%;
  --sz: 1280px;
  width: var(--sz);
}
#qrcode-canvas {
  --max-h: 100%;
  max-width: 100%;
  max-width: var(--max-h);
}
.QRCodeInput {
  width: 720px;
  max-width: 100%;
}
.QRCodeInput textarea {
  resize: none;
}
</style>
