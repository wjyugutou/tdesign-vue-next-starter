<script setup lang="ts">
import type { FormRule, SubmitContext } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

import { useCounter } from '@/hooks'

const emit = defineEmits(['register-success'])

const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
}

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  email: [
    { required: true, message: '邮箱必填', type: 'error' },
    { email: true, message: '请输入正确的邮箱', type: 'warning' },
  ],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
}

const type = ref('phone')

const form = ref()
const formData = ref({ ...INITIAL_DATA })

const showPsw = ref(false)

const [countDown, handleCounter] = useCounter()

function onSubmit(ctx: SubmitContext) {
  if (ctx.validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意TDesign服务协议和TDesign 隐私声明')
      return
    }
    MessagePlugin.success('注册成功')
    emit('register-success')
  }
}

function switchType(val: string) {
  form.value.reset()
  type.value = val
}
</script>
<template>
  <TForm
    ref="form"
    class="item-container"
    :class="[`register-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type === 'phone'">
      <TFormItem name="phone">
        <TInput v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <TIcon name="user" />
          </template>
        </TInput>
      </TFormItem>
    </template>

    <template v-if="type === 'email'">
      <TFormItem name="email">
        <TInput v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
          <template #prefix-icon>
            <TIcon name="mail" />
          </template>
        </TInput>
      </TFormItem>
    </template>

    <TFormItem name="password">
      <TInput
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <TIcon name="lock-on" />
        </template>
        <template #suffix-icon>
          <TIcon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </TInput>
    </TFormItem>

    <template v-if="type === 'phone'">
      <TFormItem class="verification-code" name="verifyCode">
        <TInput v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <TButton variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown === 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </TButton>
      </TFormItem>
    </template>

    <TFormItem class="check-container" name="checked">
      <TCheckbox v-model="formData.checked">
        我已阅读并同意
      </TCheckbox> <span>TDesign服务协议</span> 和
      <span>TDesign 隐私声明</span>
    </TFormItem>

    <TFormItem>
      <TButton block size="large" type="submit">
        注册
      </TButton>
    </TFormItem>

    <div class="switch-container">
      <span class="tip" @click="switchType(type === 'phone' ? 'email' : 'phone')">{{
        type === 'phone' ? '使用邮箱注册' : '使用手机号注册'
      }}</span>
    </div>
  </TForm>
</template>
<style lang="less" scoped>
@import '../index.less';
</style>
