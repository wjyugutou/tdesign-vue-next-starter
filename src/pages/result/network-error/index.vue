<script setup lang="ts">
import Result from '@/components/result/index.vue'

defineOptions({
  name: 'ResultNetworkError',
})
</script>
<template>
  <Result title="网络异常" tip="网络异常, 请稍后重试" type="wifi">
    <div>
      <TButton theme="default" @click="() => $router.push('/')">
        回到首页
      </TButton>
      <TButton @click="() => $router.push('/')">
        重新加载
      </TButton>
    </div>
  </Result>
</template>
