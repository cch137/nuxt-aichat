<template>
  <ClientOnly>
    <el-dropdown trigger="click" placement="bottom">
      <el-button size="small" style="padding: 8px;">
        <el-icon style="margin: 0 -0.125rem;"><More /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu style="overflow: hidden;">
          <div class="flex flex-col py-1 px-2 -m-2 -mx-3" style="margin-bottom: -10px;">
            <div>
              <el-button
                class="MoreOptionButton"
                :icon="EditPen"
                @click="renameConversation()"
              >
                {{ $t('action.renameConv') }}
              </el-button>
            </div>
            <div>
              <el-button
                class="MoreOptionButton"
                :icon="RefreshRight"
                @click="resetConvConfig(true)"
              >
                {{ $t('action.resetConv') }}
              </el-button>
            </div>
            <div>
              <el-button
                class="MoreOptionButton"
                :icon="Download"
                @click="exportAsMarkdown()"
              >
                {{ $t('action.exportAs') }} .MD
              </el-button>
            </div>
            <div>
              <el-button
                class="MoreOptionButton"
                :icon="Download"
                @click="exportAsJson()"
              >
                {{ $t('action.exportAs') }} .JSON
              </el-button>
            </div>
            <div>
              <el-button
                class="MoreOptionButton"
                :icon="RefreshRight"
                @click="refreshConversation()"
              >
                {{ $t('action.refresh') }}
              </el-button>
            </div>
            <div>
              <el-button
                type="danger"
                class="MoreOptionButton"
                :icon="Delete"
                @click="deleteConversation()"
                plain
              >
                {{ $t('action.deleteConv') }}
              </el-button>
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </ClientOnly>
</template>

<script setup>
import { More, EditPen, RefreshRight, Download, Delete, ArrowDown } from '@element-plus/icons-vue'
const { refreshConversation, renameConversation, deleteConversation, resetConvConfig, exportAsMarkdown, exportAsJson } = useChat()
</script>

<style scoped>
.MoreOptionButton {
  width: 100%;
  justify-content: start;
  border: none;
  border-radius: 0;
}
</style>
