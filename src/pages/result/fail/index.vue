<script lang="ts" setup>
import { t } from '@/locales'

defineOptions({
  name: 'ResultFail',
})
</script>
<template>
  <div class="result-success">
    <TIcon class="result-success-icon" name="error-circle" />
    <div class="result-success-title">
      {{ t('pages.result.fail.title') }}
    </div>
    <div class="result-success-describe">
      {{ t('pages.result.fail.subtitle') }}
    </div>
    <div>
      <TButton theme="default" @click="() => $router.push('/dashboard/base')">
        {{
          t('pages.result.fail.back')
        }}
      </TButton>
      <TButton @click="() => $router.push('/form/base')">
        {{ t('pages.result.fail.modify') }}
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
    color: var(--td-text-color-secondary);
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
