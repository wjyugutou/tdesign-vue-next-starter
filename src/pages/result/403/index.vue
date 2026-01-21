<script setup lang="ts">
import Result from '@/components/result/index.vue'
import { t } from '@/locales'

defineOptions({
  name: 'Result403',
})
</script>
<template>
  <Result title="403 Forbidden" :tip="'抱歉，您无权限访问此页面，企业微信联系创建者'">
    <TButton @click="() => $router.push('/')">
      {{ '返回首页' }}
    </TButton>
  </Result>
</template>
