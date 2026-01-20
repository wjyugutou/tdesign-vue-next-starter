<script setup lang="ts">
import type { FormInstanceFunctions, FormRule, SubmitContext } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCounter } from '@/hooks'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const INITIAL_DATA = {
  phone: '',
  account: 'admin',
  password: 'admin',
  verifyCode: '',
  checked: false,
}

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [{ required: true, message: '请输入手机号', type: 'error' }],
  account: [{ required: true, message: '请输入账号', type: 'error' }],
  password: [{ required: true, message: '请输入密码', type: 'error' }],
  verifyCode: [{ required: true, message: '请输入验证码', type: 'error' }],
}

const type = ref('password')

const form = ref<FormInstanceFunctions>()
const formData = ref({ ...INITIAL_DATA })
const showPsw = ref(false)

const [countDown, handleCounter] = useCounter()

function switchType(val: string) {
  type.value = val
}

const router = useRouter()
const route = useRoute()

/**
 * 发送验证码
 */
function sendCode() {
  form.value.validate({ fields: ['phone'] }).then((e) => {
    if (e === true) {
      handleCounter()
    }
  })
}

async function onSubmit(ctx: SubmitContext) {
  if (ctx.validateResult === true) {
    try {
      await userStore.login(formData.value)

      MessagePlugin.success('登录成功')
      const redirect = route.query.redirect as string
      const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard'
      router.push(redirectUrl)
    }
    catch (e) {
      console.log(e)
      MessagePlugin.error(e.message)
    }
  }
}
</script>
<template>
  <TForm
    ref="form"
    class="item-container"
    :class="[`login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type === 'password'">
      <TFormItem name="account">
        <TInput v-model="formData.account" size="large" placeholder="账号：admin">
          <template #prefix-icon>
            <TIcon name="user" />
          </template>
        </TInput>
      </TFormItem>

      <TFormItem name="password">
        <TInput
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="密码：admin"
        >
          <template #prefix-icon>
            <TIcon name="lock-on" />
          </template>
          <template #suffix-icon>
            <TIcon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </TInput>
      </TFormItem>

      <div class="check-container remember-pwd">
        <TCheckbox>记住密码</TCheckbox>
        <span class="tip">忘记密码</span>
      </div>
    </template>

    <!-- 扫码登录 -->
    <template v-else-if="type === 'qrcode'">
      <div class="tip-container">
        <span class="tip">使用微信扫一扫登录</span>
        <span class="refresh">刷新 <TIcon name="refresh" /> </span>
      </div>
      <TQrcode value="tdesign" :size="160" level="H" />
    </template>

    <!-- 手机号登录 -->
    <template v-else>
      <TFormItem name="phone">
        <TInput v-model="formData.phone" size="large" placeholder="请输入手机号">
          <template #prefix-icon>
            <TIcon name="mobile" />
          </template>
        </TInput>
      </TFormItem>

      <TFormItem class="verification-code" name="verifyCode">
        <TInput v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <TButton size="large" variant="outline" :disabled="countDown > 0" @click="sendCode">
          {{ countDown === 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </TButton>
      </TFormItem>
    </template>

    <TFormItem v-if="type !== 'qrcode'" class="btn-container">
      <TButton block size="large" type="submit">
        登录
      </TButton>
    </TFormItem>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">{{
        '账号登录'
      }}</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">
        '微信登录'
      </span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">
        '手机号登录'
      </span>
    </div>
  </TForm>
</template>
<style lang="less" scoped>
@import '../index.less';
</style>
