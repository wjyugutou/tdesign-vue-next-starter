<script setup lang="ts">
import Result from '@/components/result/index.vue'

defineOptions({
  name: 'Result404',
})
</script>
<template>
  <Result title="404 Not Found" tip="抱歉，您访问的页面不存在" type="404">
    <TButton @click="() => $router.push('/')">
      返回首页
    </TButton>
  </Result>
</template>
