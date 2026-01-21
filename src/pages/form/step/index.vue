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
          <TStepItem title="提交申请" content="已于12月21日提交" />
          <TStepItem title="电子信息" content="如有疑问联系客服" />
          <TStepItem title="发票已邮寄" content="电子发票开出后联系" />
          <TStepItem title="完成申请" content="如有疑问联系客服" />
        </TSteps>
      </TCard>

      <!-- 分步表单1 -->
      <div v-show="activeForm === 0" class="rule-tips">
        <TAlert theme="info" title="发票开具规则" :close="true">
          <template #message>
            <p>
              1、申请开票后，电子发票在1～3个工作日内开具；增值税专用发票（纸质）如资质审核通过，将在电子发票开具后10个工作日内为您寄出；
            </p>
            <p>2、开票金额为您实际支付金额；</p>
            <p>3、如有疑问请直接联系：13300001111。</p>
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
        <TFormItem label="合同名称" name="name">
          <TSelect v-model="formData1.name" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in NAME_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem label="发票类型" name="type">
          <TSelect v-model="formData1.type" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in TYPE_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem label="开票金额">
          ¥ {{ amount }}
        </TFormItem>
        <TFormItem>
          <TButton theme="primary" type="submit">
            提交申请
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
        <TFormItem label="发票抬头" name="title">
          <TInput
            v-model="formData2.title"
            :style="{ width: '480px' }"
            placeholder="请输入发票抬头"
          />
        </TFormItem>
        <TFormItem label="纳税人识别号" name="taxNum">
          <TInput
            v-model="formData2.taxNum"
            :style="{ width: '480px' }"
            placeholder="请输入纳税人识别号"
          />
        </TFormItem>
        <TFormItem label="地址" name="address">
          <TInput
            v-model="formData2.address"
            :style="{ width: '480px' }"
            placeholder="请输入地址"
          />
        </TFormItem>
        <TFormItem label="开户行" name="bank">
          <TInput
            v-model="formData2.bank"
            :style="{ width: '480px' }"
            placeholder="请输入开户行"
          />
        </TFormItem>
        <TFormItem label="银行账号" name="bankAccount">
          <TInput
            v-model="formData2.bankAccount"
            :style="{ width: '480px' }"
            placeholder="请输入银行账号"
          />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput
            v-model="formData2.email"
            :style="{ width: '480px' }"
            placeholder="请输入邮箱"
          />
        </TFormItem>
        <TFormItem label="手机号" name="tel">
          <TInput
            v-model="formData2.tel"
            :style="{ width: '480px' }"
            placeholder="请输入手机号"
          />
        </TFormItem>
        <TFormItem>
          <TButton type="reset" theme="default" variant="base">
            上一步
          </TButton>
          <TButton theme="primary" type="submit">
            下一步
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
        <TFormItem label="收货人" name="consignee">
          <TInput v-model="formData3.consignee" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem label="手机号码" name="mobileNum">
          <TInput v-model="formData3.mobileNum" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem label="收货地址" name="deliveryAddress">
          <TSelect v-model="formData3.deliveryAddress" :style="{ width: '480px' }" class="demo-select-base" clearable>
            <TOption v-for="(item, index) in ADDRESS_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem label="详细地址" name="fullAddress">
          <TTextarea v-model="formData3.fullAddress" :style="{ width: '480px' }" />
        </TFormItem>
        <TFormItem>
          <TButton type="reset" theme="default" variant="base">
            上一步
          </TButton>
          <TButton theme="primary" type="submit">
            下一步
          </TButton>
        </TFormItem>
      </TForm>

      <!-- 分步表单4 -->
      <div v-show="activeForm === 6" class="step-form-4">
        <TSpace direction="vertical" style="align-items: center">
          <TIcon name="check-circle-filled" style="color: green" size="52px" />
          <p class="text">
            完成开票申请
          </p>
          <p class="tips">
            预计1～3个工作日会将电子发票发至邮箱，发票邮寄请耐心等待
          </p>
          <div class="button-group">
            <TButton theme="primary" @click="onReset(0)">
              再次申请
            </TButton>
            <TButton variant="base" theme="default" @click="complete">
              查看进度
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
