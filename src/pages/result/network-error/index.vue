<script setup lang="ts">
import Result from '@/components/result/index.vue'
import { t } from '@/locales'

defineOptions({
  name: 'ResultNetworkError',
})
</script>
<template>
  <Result :title="t('pages.result.networkError.title')" :tip="t('pages.result.networkError.subtitle')" type="wifi">
    <div>
      <TButton theme="default" @click="() => $router.push('/')">
        {{ t('pages.result.networkError.back') }}
      </TButton>
      <TButton @click="() => $router.push('/')">
        {{ t('pages.result.networkError.reload') }}
      </TButton>
    </div>
  </Result>
</template>
