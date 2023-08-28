<template>
  <div class="flex-col w-full max-w-prose p-4 m-auto" style="height: calc(100vh - 56px);">
    <h1>{{ $t('auth.title') }}</h1>
    <h3>{{ $t('auth.username') }}</h3>
    <div class="flex gap-2">
      <el-input v-model="newUsername"
        type="text"
        :formatter="//@ts-ignore
          (v) => v.replace(/[^\w]+/g, '')"
        :parser="(v) => v.replace(/[^\w]+/g, '')" />
      <el-button :type="usernameIsNotSaved ? 'primary' : ''"
        :disabled="!usernameIsNotSaved"
        :loading="usernameIsSaving" @click="saveUsername()">{{ $t('action.save') }}</el-button>
    </div>
    <h3>{{ $t('auth.passwd') }}</h3>
    <NuxtLink href="/acc/reset-password">
      <el-button>{{ $t('auth.resetPw') }}</el-button>
    </NuxtLink>
    <h3>{{ $t('auth.email') }}</h3>
    <div class="opacity-60" @click="() => ElMessage.info('Email address cannot be changed.')">
      <el-input v-model="email" type="email" disabled class="pointer-events-none" />
    </div>
    <h3>Permission Level</h3>
    <div class="opacity-60" @click="() => ElMessage.info('Please contact the administrator to change the permission level.')">
      <el-input v-model="authlvl" type="text" disabled class="pointer-events-none" />
    </div>
    <h1>{{ $t('settings.appearance') }}</h1>
    <CommonSettings />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const i18n = useLocale()
// @ts-ignore
const _t = i18n.t

const { email, username, authlvl, changeUsername } = useAuth()

const usernameIsNotSaved = ref(false)
const usernameIsSaving = ref(false)
const newUsername = ref(username.value)
const saveUsername = async () => {
  usernameIsSaving.value = true
  try {
    const isChanged = await changeUsername(newUsername.value)
    usernameIsNotSaved.value = !isChanged
    if (isChanged) {
      newUsername.value = username.value
    }
  } finally {
    usernameIsSaving.value = false
  }
}
watch(newUsername, (value) => {
  usernameIsNotSaved.value = value !== username.value
})

useTitle(`${_t('auth.profile')} - ${useState('appName').value}`)
definePageMeta({
  layout: 'default',
  middleware: ['no-headless', 'only-auth']
})
</script>

<style>
</style>
