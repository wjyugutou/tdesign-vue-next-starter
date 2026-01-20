<script setup lang="ts">
import type { FormRules, SubmitContext } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref, watch } from 'vue'

import { t } from '@/locales'

export interface FormData {
  name: string
  status: string
  description: string
  type: string
  mark: string
  amount: number
}

const { visible, data } = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<FormData>,
    default: undefined,
  },
})

const emit = defineEmits(['update:visible'])

const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
}

const SELECT_OPTIONS = [
  { label: '网关', value: '1' },
  { label: '人工智能', value: '2' },
  { label: 'CVM', value: '3' },
]

const formVisible = ref(false)
const formData = ref({ ...INITIAL_DATA })
const textareaValue = ref('')

function onSubmit({ validateResult, firstError }: SubmitContext) {
  if (!firstError) {
    MessagePlugin.success('提交成功')
    formVisible.value = false
  }
  else {
    console.log('Errors: ', validateResult)
    MessagePlugin.warning(firstError)
  }
}

function onClickCloseBtn() {
  formVisible.value = false
  formData.value = { ...INITIAL_DATA }
}

watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val)
  },
)

watch(
  () => visible,
  (val) => {
    formVisible.value = val
  },
)

watch(
  () => data,
  (val) => {
    formData.value = val
  },
)

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
}
</script>
<template>
  <TDialog v-model:visible="formVisible" :header="t('pages.listCard.create')" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <TForm :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <TFormItem :label="t('pages.listCard.productName')" name="name">
          <TInput v-model="formData.name" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem :label="t('pages.listCard.productStatus')" name="status">
          <TRadioGroup v-model="formData.status">
            <TRadio value="0">
              {{ t('pages.listCard.productStatusEnum.off') }}
            </TRadio>
            <TRadio value="1">
              {{ t('pages.listCard.productStatusEnum.on') }}
            </TRadio>
          </TRadioGroup>
        </TFormItem>
        <TFormItem :label="t('pages.listCard.productDescription')" name="description">
          <TInput v-model="formData.description" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem :label="t('pages.listCard.productType')" name="type">
          <TSelect v-model="formData.type" clearable :style="{ width: '480px' }">
            <TOption v-for="(item, index) in SELECT_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem :label="t('pages.listCard.productRemark')" name="mark">
          <TTextarea v-model="textareaValue" :style="{ width: '480px' }" name="description" />
        </TFormItem>
        <TFormItem style="float: right">
          <TButton variant="outline" @click="onClickCloseBtn">
            取消
          </TButton>
          <TButton theme="primary" type="submit">
            确定
          </TButton>
        </TFormItem>
      </TForm>
    </template>
  </TDialog>
</template>
