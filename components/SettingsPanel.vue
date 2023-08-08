<template>
  <el-dialog v-model="openSettings" title="Settings" width="80%" style="max-width: 600px;">
    <div class="px-2 pb-4 flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <div>
          <el-text size="large">{{ $t('settings.lang') }}</el-text>
        </div>
        <div>
          <ChatbotLanguageSelect />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div>
          <el-text size="large">Theme</el-text>
        </div>
        <div>
          <ColorModeSelect />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div>
          <NuxtLink href="/acc/reset-password">
            <el-link>> Reset Password</el-link>
          </NuxtLink>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const { openSettings } = useSettings()
</script>