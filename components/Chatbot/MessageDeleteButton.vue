<template>
  <ClientOnly>
    <el-popover
      placement="bottom"
      :width="160"
      trigger="click"
      :visible="visible"
    >
      <template #reference>
        <div @click="openPopover">
          <el-text
            type="info"
            class="MessageActionButton flex-center w-full cursor-pointer"
          >
            <el-icon size="larger">
              <Delete />
            </el-icon>
          </el-text>
        </div>
      </template>
      <template #default>
        <div class="p-5 -m-5">
          <div style="word-break: break-word; text-align: start;">
            {{ $t('message.deleteMsgConfirm') }}
          </div>
          <div class="mt-2">
            <el-button size="small" @click="_cancel()">{{ $t('message.no') }}</el-button>
            <el-button size="small" @click="_confirm()" style="margin: 0 .5rem;">{{ $t('message.yes') }}</el-button>
          </div>
        </div>
      </template>
    </el-popover>
  </ClientOnly>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'
</script>

<script>
export default {
  props: ['cancel', 'confirm'],
  data () {
    return {
      timeout: null,
      visible: false
    }
  },
  methods: {
    closePopover () {
      this.visible = false
      clearTimeout(this.timeout)
    },
    openPopover () {
      this.visible = true
      this.timeout = setTimeout(() => this.closePopover(), 5000)
    },
    _cancel () {
      this.closePopover()
      if (this.cancel) {
        this.cancel()
      }
    },
    _confirm () {
      this.closePopover()
      if (this.confirm) {
        this.confirm()
      }
    },
  }
}
</script>
