<script setup lang="ts">
import type { SubmitContext } from 'tdesign-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { t } from '@/locales'

import {
  ADDRESS_OPTIONS,
  FORM_RULES,
  INITIAL_DATA1,
  INITIAL_DATA2,
  INITIAL_DATA3,
  NAME_OPTIONS,
  TYPE_OPTIONS,
} from './constants'

defineOptions({
  name: 'FormStep',
})

const formData1 = ref({ ...INITIAL_DATA1 })
const formData2 = ref({ ...INITIAL_DATA2 })
const formData3 = ref({ ...INITIAL_DATA3 })
const activeForm = ref(0)

const amount = computed(() => {
  if (formData1.value.name === '1') {
    return '565421'
  }
  if (formData1.value.name === '2') {
    return '278821'
  }
  if (formData1.value.name === '3') {
    return '109824'
  }
  return '--'
})

function onSubmit(result: SubmitContext, val: number) {
  if (result.validateResult === true) {
    activeForm.value = val
  }
}
function onReset(val: number) {
  activeForm.value = val
}
function complete() {
  const router = useRouter()
  router.replace({ path: '/detail/advanced' })
}
</script>
<template>
  <div>
    <div class="form-step-container">
      <!-- 简单步骤条 -->
      <TCard :bordered="false">
        <TSteps class="step-container" :current="1" status="process">
          <TStepItem :title="t('pages.formStep.step1.title')" :content="t('pages.formStep.step1.subtitle')" />
          <TStepItem :title="t('pages.formStep.step2.title')" :content="t('pages.formStep.step2.subtitle')" />
          <TStepItem :title="t('pages.formStep.step3.title')" :content="t('pages.formStep.step3.subtitle')" />
          <TStepItem :title="t('pages.formStep.step4.title')" :content="t('pages.formStep.step4.subtitle')" />
        </TSteps>
      </TCard>

      <!-- 分步表单1 -->
      <div v-show="activeForm === 0" class="rule-tips">
        <TAlert theme="info" :title="t('pages.formStep.step1.rules')" :close="true">
          <template #message>
            <p>
              {{ t('pages.formStep.step1.rule1') }}
            </p>
            <p>{{ t('pages.formStep.step1.rule2') }}</p>
            <p>{{ t('pages.formStep.step1.rule3') }}</p>
          </template>
        </TAlert>
      </div>
      <TForm
        v-show="activeForm === 0"
        class="step-form"
        :data="formData1"
        :rules="FORM_RULES"
        label-align="right"
        @submit="(result: SubmitContext) => onSubmit(result, 1)"
      >
        <TFormItem :label="t('pages.formStep.step1.contractName')" name="name">
          <TSelect v-model="formData1.name" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in NAME_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step1.invoiceType')" name="type">
          <TSelect v-model="formData1.type" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in TYPE_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step1.amount')">
          ¥ {{ amount }}
        </TFormItem>
        <TFormItem>
          <TButton theme="primary" type="submit">
            {{ t('pages.formStep.step1.submit') }}
          </TButton>
        </TFormItem>
      </TForm>

      <!-- 分步表单2 -->
      <TForm
        v-show="activeForm === 1"
        class="step-form"
        :data="formData2"
        :rules="FORM_RULES"
        label-align="left"
        @reset="onReset(0)"
        @submit="(result: SubmitContext) => onSubmit(result, 2)"
      >
        <TFormItem :label="t('pages.formStep.step2.invoiceTitle')" name="title">
          <TInput
            v-model="formData2.title"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.invoiceTitlePlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.taxNum')" name="taxNum">
          <TInput
            v-model="formData2.taxNum"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.taxNumPlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.address')" name="address">
          <TInput
            v-model="formData2.address"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.addressPlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.bank')" name="bank">
          <TInput
            v-model="formData2.bank"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.bankPlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.bankAccount')" name="bankAccount">
          <TInput
            v-model="formData2.bankAccount"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.bankAccountPlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.email')" name="email">
          <TInput
            v-model="formData2.email"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.emailPlaceholder')"
          />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step2.tel')" name="tel">
          <TInput
            v-model="formData2.tel"
            :style="{ width: '480px' }"
            :placeholder="t('pages.formStep.step2.telPlaceholder')"
          />
        </TFormItem>
        <TFormItem>
          <TButton type="reset" theme="default" variant="base">
            {{ t('pages.formStep.preStep') }}
          </TButton>
          <TButton theme="primary" type="submit">
            {{ t('pages.formStep.nextStep') }}
          </TButton>
        </TFormItem>
      </TForm>

      <!-- 分步表单3 -->
      <TForm
        v-show="activeForm === 2"
        class="step-form"
        :data="formData3"
        :rules="FORM_RULES"
        label-align="left"
        @reset="onReset(1)"
        @submit="(result: SubmitContext) => onSubmit(result, 6)"
      >
        <TFormItem :label="t('pages.formStep.step3.consignee')" name="consignee">
          <TInput v-model="formData3.consignee" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step3.mobileNum')" name="mobileNum">
          <TInput v-model="formData3.mobileNum" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step3.deliveryAddress')" name="deliveryAddress">
          <TSelect v-model="formData3.deliveryAddress" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in ADDRESS_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem :label="t('pages.formStep.step3.fullAddress')" name="fullAddress">
          <TTextarea v-model="formData3.fullAddress" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem>
          <TButton type="reset" theme="default" variant="base">
            {{ t('pages.formStep.preStep') }}
          </TButton>
          <TButton theme="primary" type="submit">
            {{ t('pages.formStep.nextStep') }}
          </TButton>
        </TFormItem>
      </TForm>

      <!-- 分步表单4 -->
      <div v-show="activeForm === 6" class="step-form-4">
        <TSpace direction="vertical" style="align-items: center">
          <TIcon name="check-circle-filled" style="color: green" size="52px" />
          <p class="text">
            {{ t('pages.formStep.step4.finishTitle') }}
          </p>
          <p class="tips">
            {{ t('pages.formStep.step4.finishTips') }}
          </p>
          <div class="button-group">
            <TButton theme="primary" @click="onReset(0)">
              {{ t('pages.formStep.step4.reapply') }}
            </TButton>
            <TButton variant="base" theme="default" @click="complete">
              {{ t('pages.formStep.step4.check') }}
            </TButton>
          </div>
        </TSpace>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
