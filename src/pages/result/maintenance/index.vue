<script setup lang="ts">
import Result from '@/components/result/index.vue'
import { t } from '@/locales'

defineOptions({
  name: 'ResultMaintenance',
})
</script>
<template>
  <Result title="系统维护中" tip="系统维护中，请稍后再试" type="maintenance">
    <TButton theme="primary" @click="() => $router.push('/')">
      回到首页
    </TButton>
  </Result>
</template>
