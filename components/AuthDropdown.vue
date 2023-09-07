<template>
  <ClientOnly>
    <SettingsPanel />
    <el-dropdown v-model="isLoggedIn" trigger="click">
      <el-button class="AuthDropdownMenuBtn">
        <el-icon v-if="isLoggedIn" class="AuthDropdownUserFilledIcon"><UserFilled /></el-icon>
        <span class="AuthDropdownUsername flex-center">{{ isLoggedIn ? username : $t('auth.login') }}</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="AuthDropdownMenu" style="min-width: 120px;">
          <el-dropdown-item v-if="!isLoggedIn" size="large" :icon="CircleCheck" @click="navigateTo('/login')">
            {{ $t('auth.login') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isLoggedIn && currentRoute.path !== '/acc/profile'" size="large" :icon="Avatar" @click="navigateTo('/acc/profile')">
            {{ $t('auth.profile') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isLoggedIn && !currentRoute.path.startsWith('/c/')" size="large" :icon="ChatLineRound" @click="navigateTo('/c/')">
            {{ $t('page.aiChat') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="currentRoute.path !== '/acc/profile'" size="large" :icon="Setting" @click="openSettings = true">
            {{ $t('settings.title') }}
          </el-dropdown-item>
          <el-dropdown-item divided size="large" :icon="Crop" @click="navigateTo('/tools/qr-code')">
            {{ $t('page.qrCode') }}
          </el-dropdown-item>
          <el-dropdown-item divided v-if="isLoggedIn" size="large" :icon="CircleClose" @click="logout()">
            {{ $t('auth.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </ClientOnly>
</template>

<script setup>
import { Avatar, Setting, ChatLineRound, Crop, CircleCheck, CircleClose, ArrowDown, UserFilled } from '@element-plus/icons-vue'
const { username, isLoggedIn, authIsLoading, logout } = useAuth()
const { openSettings } = useSettings()
const currentRoute = useNuxtApp().$router.currentRoute
</script>

<style>
.AuthDropdownMenuBtn {
  padding-left: 12px;
  padding-right: 6px;
}
.AuthDropdownUsername {
  max-width: 20vw;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 28px;
}
.AuthDropdownUserFilledIcon {
  transform: scale(1.25) translateX(-2px);
}
.AuthDropdownButton {
  width: 100%;
  justify-content: start;
  border: none;
  border-radius: 0;
}
.AuthDropdownMenu i {
  transform: scale(1.35) translateX(-2px);
}
</style>
