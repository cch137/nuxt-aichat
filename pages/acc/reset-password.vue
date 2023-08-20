<template>
  <ClientOnly>
    <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    class="flex-col flex-center w-full max-w-xs px-4 m-auto"
    style="height: calc(100vh - 56px);"
  >
      <h1 class="mt-0 mb-6">{{ $t('auth.resetPw') }}</h1>
      <el-form-item :label="$t('auth.email')" :style="step === 1 ? 'margin-bottom: 0;' : ''" prop="email" class="inputWrapper SignupInputAnim1">
        <el-input
          :key="step"
          v-model="ruleForm.email"
          type="email"
          size="large"
          :prefix-icon="Message"
          :readonly="step > 0"
          :disabled="step > 0"
        ></el-input>
      </el-form-item>
      <div v-if="step === 1" class="-mt-1 mb-2 w-full text-right">
        <el-link type="primary" @click="changeEmailAddress" style="font-size: small;">
          <el-icon size="small" class="mr-1"><EditPen /></el-icon>
          <span>{{ $t('action.change') }}</span>
        </el-link>
      </div>
      <el-form-item v-if="step === 1" :label="$t('auth.passwd')" prop="password" class="inputWrapper SignupInputAnim2 SignupPasswordInputWrapper">
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
      <el-form-item v-if="step === 1" :label="$t('auth.veriCode')" prop="veriCode" class="inputWrapper SignupInputAnim2">
        <el-input
          v-model="ruleForm.veriCode"
          type="text"
          size="large"
          maxLength="6"
          :prefix-icon="CircleCheck"
        ></el-input>
      </el-form-item>
      <div v-if="step === 1 && !resent" class="flex-center flex-col gap-1 w-full">
        <div class="flex justify-end gap-1 w-full">
          <el-text type="info" style="font-size: small;">{{ $t('auth.notReceiveVeriCode') }} </el-text>
          <el-link type="primary" style="font-size: small;" @click="resendVerificationCode">{{ $t('action.resend') }}</el-link>
        </div>
      </div>
      <div class="p-6"></div>
      <div v-if="step === 0" class="flex-center">
        <el-button size="large" type="primary" @click="getVerifictionCode(ruleFormRef as FormInstance)">
          {{ $t('auth.getVeriCode') }}
        </el-button>
      </div>
      <div v-if="step === 1" class="flex-center">
        <el-button size="large" type="primary" @click="resetPw(ruleFormRef as FormInstance)">
          {{ $t('action.submit') }}
        </el-button>
      </div>
      <div class="p-2"></div>
      <div class="flex-center flex-col gap-1">
        <div class="flex-center flex-wrap gap-1" style="line-height: 1rem;">
          <el-link type="primary" @click="historyBack()">{{ $t('action.back') }}</el-link>
        </div>
      </div>
      <div class="p-8" />
    </el-form>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { Message, Key, CircleCheck, EditPen } from '@element-plus/icons-vue'

const i18n = useLocale()
// @ts-ignore
const _t = i18n.t

const resent = ref(false)

// STEPS:
// 0: input email & password, get verification code
// 1: verify, reset pw
const step = ref(0)

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  email: '',
  password: '',
  veriCode: ''
})

const historyBack = () => {
  history.back()
}

const rules = reactive<FormRules>({
  email: [
    { required: true, message: _t('auth.emailRequired'), trigger: 'change' },
    { type: 'email', message: _t('auth.emailInvalid'), trigger: 'change' }
  ],
  password: [
    { required: true, message: _t('auth.passwdRequired'), trigger: 'change' },
    { min: 8, max: 64, message: _t('auth.passwdLength'), trigger: 'change' },
  ],
  veriCode: [
    { required: true, message: _t('auth.veriCodeRequired'), trigger: 'change' },
    { min: 6, max: 6, message: _t('auth.veriCodeRequired'), trigger: 'change' },
  ],
})

const changeEmailAddress = () => {
  ElMessageBox.confirm(
    _t('auth.confirmChangeEmail'),
    '',
    {
      confirmButtonText: _t('message.ok'),
      cancelButtonText: _t('message.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      step.value = 0
      ruleForm.email = ''
      ruleForm.veriCode = ''
      ElMessage.success(_t('action.opExecuted'))
    })
    .catch(() => {
      ElMessage.info(_t('action.opCanceled'))
    })
}

const resendVerificationCode = () => {
  resent.value = true
  getVerifictionCode(ruleFormRef.value as FormInstance, true)
}

const getVerifictionCode = async (formEl: FormInstance, resend = false) => {
  await formEl.validate((valid, fields) => {
    if (valid || resend) {
      const loading = ElLoading.service({
        text: _t('auth.sendingVeriCode')
      })
      $fetch(resend ? '/api/auth/resendCode' : '/api/auth/createVerification', {
        method: 'POST',
        body: { email: ruleForm.email }
      })
        .then((_res) => {
          const res = _res as any
          if (res?.error) {
            ElMessage.error(res?.error)
          } else {
            ElMessage.success('Email sent, please check your inbox.')
            step.value = 1
          }
        })
        .catch(() => {
          ElMessage.error('Oops! Something went wrong.')
        })
        .finally(() => {
          loading.close()
        })
    } else {
      ElMessage.error(_t('auth.formIncomplete'))
    }
  })
}

const resetPw = async (formEl: FormInstance) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      const loading = ElLoading.service({
        text: _t('action.submitting') + '...'
      })
      $fetch('/api/auth/resetPassword', {
        method: 'POST',
        body: {
          email: ruleForm.email,
          password: ruleForm.password,
          code: ruleForm.veriCode
        }
      })
        .then((_res) => {
          const res = _res as any
          if (res?.error) {
            ElMessage.error(res?.error)
          } else {
            ElMessage.success('Password reset successful.')
            navigateTo('/acc/profile')
          }
        })
        .catch(() => {
          ElMessage.error('Oops! Something went wrong.')
        })
        .finally(() => {
          loading.close()
        })
    } else {
      ElMessage.error(_t('auth.formIncomplete'))
    }
  })
}

useTitle(`${_t('auth.resetPw')} - ${useState('appName').value}`)
definePageMeta({
  layout: 'default',
  middleware: []
})
</script>

<style>
@keyframes signupInputAnim1 {
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
@keyframes signupInputAnim2 {
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
.SignupPasswordInputWrapper .el-input__prefix svg {
  transform: scale(1.25) rotateZ(90deg);
}
.SignupPasswordInputWrapper .el-input__suffix i {
  color: inherit !important;
  animation: none !important;
}
.SignupInputAnim1 .is-focus i {
  animation: signupInputAnim1 .5s;
}
.SignupInputAnim2 .is-focus i {
  animation: signupInputAnim2 .5s;
}
</style>
