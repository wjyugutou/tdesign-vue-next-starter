<script setup lang="ts">
import TdesignSetting from '@/layouts/setting.vue'
import LoginHeader from './components/Header.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

defineOptions({
  name: 'LoginIndex',
})
const type = ref('login')
function switchType(val: string) {
  type.value = val
}
</script>
<template>
  <div class="login-wrapper">
    <LoginHeader />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">
          登录
        </h1>
        <h1 class="title">
          TDesign Starter
        </h1>
        <div class="sub-title">
          <p class="tip">
            {{ type === 'register' ? '已有账号' : '没有账号' }}
          </p>
          <p class="tip" @click="switchType(type === 'register' ? 'login' : 'register')">
            {{ type === 'register' ? '登录' : '注册' }}
          </p>
        </div>
      </div>

      <Login v-if="type === 'login'" />
      <Register v-else @register-success="switchType('login')" />
      <TdesignSetting />
    </div>

    <footer class="copyright">
      Copyright @ 2021-2025 Tencent. All Rights Reserved
    </footer>
  </div>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
