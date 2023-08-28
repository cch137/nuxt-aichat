<template>
  <div>
    <ClientOnly>
      <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      class="flex-col flex-center w-full max-w-xs px-4 m-auto"
      style="height: calc(100vh - 56px);"
    >
        <h1 class="mt-0 mb-6">{{ $t('auth.login') }}</h1>
        <el-form-item :label="$t('auth.usernameOrEmail')" prop="usernameOrEmail" class="inputWrapper LoginInputAnim1">
          <el-input
            v-model="ruleForm.usernameOrEmail"
            type="text"
            size="large"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('auth.passwd')" prop="password" class="inputWrapper LoginInputAnim2 LoginPasswordInputWrapper">
          <el-input
            v-model="ruleForm.password"
            type="password"
            size="large"
            :prefix-icon="Key"
            :formatter="//@ts-ignore
              (v) => v.trim()"
            :parser="(v) => v.trim()"
            show-password
          ></el-input>
        </el-form-item>
        <div class="p-6"></div>
        <div class="flex-center">
          <el-button size="large" type="primary" @click="login(ruleFormRef as FormInstance)">
            {{ $t('auth.login') }}
          </el-button>
        </div>
        <div class="p-2"></div>
        <div class="flex-center flex-col gap-2">
          <div class="flex-center flex-wrap gap-1" style="line-height: 1rem;">
            <el-text type="info">{{ $t('auth.createNewAcc') }}</el-text>
            <el-link type="primary">
              <NuxtLink to="/signup">{{ $t('auth.signup') }}</NuxtLink>
            </el-link>
          </div>
          <div class="flex-center flex-wrap gap-1" style="line-height: 1rem;">
            <el-link type="primary">
              <NuxtLink to="/acc/reset-password">{{ $t('auth.resetPw') }}</NuxtLink>
            </el-link>
          </div>
        </div>
        <div style="line-height: 1rem;" class="mt-2 text-center">
          <el-text size="small" type="info" style="word-break: break-word;">
            {{ $t('auth.loginTip1') }}
          </el-text>
        </div>
        <div class="p-8" />
      </el-form>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Key } from '@element-plus/icons-vue'

const { login: _login } = useAuth()
const i18n = useLocale()
// @ts-ignore
const _t = i18n.t

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  usernameOrEmail: '',
  password: '',
})

const rules = reactive<FormRules>({
  usernameOrEmail: [
    { required: true, message: _t('auth.usernameOrEmailRequired'), trigger: 'change' },
  ],
  password: [
    { required: true, message: _t('auth.passwdRequired'), trigger: 'change' },
  ],
})

const login = async (formEl: FormInstance) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      _login(ruleForm.usernameOrEmail, ruleForm.password)
    } else {
      ElMessage.error(_t('auth.formIncomplete'))
    }
  })
}

useTitle(`${_t('auth.login')} - ${useState('appName').value}`)
definePageMeta({
  layout: 'default',
  middleware: ['auto-redirector', 'only-no-auth']
})
</script>

<style>
@keyframes loginInputAnim1 {
  0% {
    transform: rotateZ(0deg);
  }
  25% {
    transform: rotateZ(-15deg);
  }
  75% {
    transform: rotateZ(15deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
@keyframes loginInputAnim2 {
  0% {
    transform: rotateZ(0deg);
  }
  50% {
    transform: rotateZ(-33deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.inputWrapper {
  width: 100%;
}
.inputWrapper .is-focus i {
  color: var(--el-color-primary);
}
.inputWrapper.is-error i {
  color: var(--el-color-danger);
}
.inputWrapper svg {
  transform: scale(1.25);
}
.LoginPasswordInputWrapper .el-input__prefix svg {
  transform: scale(1.25) rotateZ(90deg);
}
.LoginPasswordInputWrapper .el-input__suffix i {
  color: inherit !important;
  animation: none !important;
}
.LoginInputAnim1 .is-focus i {
  animation: loginInputAnim1 .5s;
}
.LoginInputAnim2 .is-focus i {
  animation: loginInputAnim2 .5s;
}
</style>
