<script setup lang="ts">
import { t } from '@/locales'

defineOptions({
  name: 'ResultSuccess',
})
</script>
<template>
  <div class="result-success">
    <TIcon class="result-success-icon" name="check-circle" />
    <div class="result-success-title">
      项目已创建成功
    </div>
    <div class="result-success-describe">
      可以联系负责人分发应用
    </div>
    <div>
      <TButton theme="default" @click="() => $router.push('/detail/advanced')">
        查看进度
      </TButton>
      <TButton @click="() => $router.push('/dashboard/base')">
        回到首页
      </TButton>
    </div>
  </div>
</template>
<style lang="less" scoped>
.result-success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;

  &-icon {
    font-size: var(--td-comp-size-xxxxl);
    color: var(--td-success-color);
  }

  &-title {
    margin-top: var(--td-comp-margin-xxl);
    font: var(--td-font-title-large);
    color: var(--td-text-color-primary);
    text-align: center;
  }

  &-describe {
    margin: var(--td-comp-margin-s) 0 var(--td-comp-margin-xxxl);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
  }
}
</style>
