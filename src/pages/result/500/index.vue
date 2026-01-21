<script setup lang="ts">
import Result from '@/components/result/index.vue'

defineOptions({
  name: 'Result500',
})
</script>
<template>
  <Result title="500 Internal Server Error" type="500" tip="抱歉，服务器出错啦">
    <TButton @click="() => $router.push('/')">
      返回首页
    </TButton>
  </Result>
</template>
