<script setup lang="ts">
import LogoFullIcon from '@/assets/assets-logo-full.svg?component'
import { useSettingStore } from '@/store'

const settingStore = useSettingStore()

function toggleSettingPanel() {
  settingStore.updateConfig({
    showSettingPanel: true,
  })
}

function navToGitHub() {
  window.open('https://github.com/tencent/tdesign-vue-next-starter')
}

function navToHelper() {
  window.open('http://tdesign.tencent.com/starter/docs/get-started')
}
</script>
<template>
  <header class="login-header">
    <LogoFullIcon class="logo" />
    <div class="operations-container">
      <TButton theme="default" shape="square" variant="text" @click="navToGitHub">
        <TIcon name="logo-github" class="icon" />
      </TButton>
      <TButton theme="default" shape="square" variant="text" @click="navToHelper">
        <TIcon name="help-circle" class="icon" />
      </TButton>
      <TButton theme="default" shape="square" variant="text" @click="toggleSettingPanel">
        <TIcon name="setting" class="icon" />
      </TButton>
    </div>
  </header>
</template>
<style lang="less" scoped>
.login-header {
  padding: 0 var(--td-comp-paddingLR-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  color: var(--td-text-color-primary);
  height: var(--td-comp-size-xxxl);

  .logo {
    width: 178px;
    height: var(--td-comp-size-s);
  }

  .operations-container {
    display: flex;
    align-items: center;

    .t-button {
      margin-left: var(--td-comp-margin-l);
    }
  }
}
</style>
