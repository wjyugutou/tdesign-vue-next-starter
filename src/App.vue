<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next'

import { merge } from 'lodash-es'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import { computed } from 'vue'
import { useSettingStore } from '@/store'

const store = useSettingStore()

const mode = computed(() => {
  return store.displayMode
})

const empty: GlobalConfigProvider = {}
const customConfig: GlobalConfigProvider = {
  // 可以在此处定义更多自定义配置，具体可配置内容参看 API 文档
  calendar: {},
  table: {},
  pagination: {},
}
const globalConfig: GlobalConfigProvider = merge(empty, zhConfig, customConfig)
</script>
<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView :class="[mode]" />
  </TConfigProvider>
</template>
<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
