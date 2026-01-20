<script setup lang="ts">
import type { SubmitContext, UploadFailContext, UploadFile } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

import { t } from '@/locales'

import { FORM_RULES, INITIAL_DATA, PARTY_A_OPTIONS, PARTY_B_OPTIONS, TYPE_OPTIONS } from './constants'

defineOptions({
  name: 'FormBase',
})

const formData = ref({ ...INITIAL_DATA })

function onReset() {
  MessagePlugin.warning('取消新建')
}
function onSubmit(ctx: SubmitContext) {
  if (ctx.validateResult === true) {
    MessagePlugin.success('新建成功')
  }
}
function beforeUpload(file: UploadFile) {
  if (!/\.pdf$/.test(file.name)) {
    MessagePlugin.warning('请上传pdf文件')
    return false
  }
  if (file.size > 60 * 1024 * 1024) {
    MessagePlugin.warning('上传文件不能大于60M')
    return false
  }
  return true
}
function handleFail(options: UploadFailContext) {
  MessagePlugin.error(`文件 ${options.file.name} 上传失败`)
}
// 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
function formatResponse(res: any) {
  return { ...res, error: '上传失败，请重试', url: res.url }
}
</script>
<template>
  <TForm
    class="base-form"
    :data="formData"
    :rules="FORM_RULES"
    label-align="top"
    :label-width="100"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div class="form-basic-container">
      <div class="form-basic-item">
        <div class="form-basic-container-title">
          {{ t('pages.formBase.title') }}
        </div>
        <!-- 表单内容 -->

        <!-- 合同名称,合同类型 -->
        <TRow class="row-gap" :gutter="[32, 24]">
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.contractName')" name="name">
              <TInput v-model="formData.name" :style="{ width: '322px' }" placeholder="请输入内容" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.contractType')" name="type">
              <TSelect v-model="formData.type" :style="{ width: '322px' }" class="demo-select-base" clearable>
                <TOption v-for="(item, index) in TYPE_OPTIONS" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>

          <!-- 合同收付类型 -->
          <TCol :span="8">
            <TFormItem :label="t('pages.formBase.contractPayType')" name="payment">
              <TRadioGroup v-model="formData.payment">
                <TRadio value="1">
                  {{ t('pages.formBase.receive') }}
                </TRadio>
                <TRadio value="2">
                  {{ t('pages.formBase.pay') }}
                </TRadio>
              </TRadioGroup>
              <span class="space-item" />
              <div>
                <TInput :placeholder="t('pages.formBase.contractAmountPlaceholder')" :style="{ width: '160px' }" />
              </div>
            </TFormItem>
          </TCol>

          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.company')" name="partyA">
              <TSelect
                v-model="formData.partyA"
                :style="{ width: '322px' }"
                class="demo-select-base"
                :placeholder="t('pages.formBase.contractTypePlaceholder')"
                clearable
              >
                <TOption v-for="(item, index) in PARTY_A_OPTIONS" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.employee')" name="partyB">
              <TSelect
                v-model="formData.partyB"
                :style="{ width: '322px' }"
                :placeholder="t('pages.formBase.contractTypePlaceholder')"
                class="demo-select-base"
                clearable
              >
                <TOption v-for="(item, index) in PARTY_B_OPTIONS" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.contractSignDate')" name="signDate">
              <TDatePicker
                v-model="formData.signDate"
                :style="{ width: '322px' }"
                theme="primary"
                mode="date"
                separator="/"
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.contractEffectiveDate')" name="startDate">
              <TDatePicker
                v-model="formData.startDate"
                :style="{ width: '322px' }"
                theme="primary"
                mode="date"
                separator="/"
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.contractEndDate')" name="endDate">
              <TDatePicker
                v-model="formData.endDate"
                :style="{ width: '322px' }"
                theme="primary"
                mode="date"
                separator="/"
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem :label="t('pages.formBase.upload')" name="files">
              <TUpload
                v-model="formData.files"
                action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                :tips="t('pages.formBase.uploadTips')"
                :size-limit="{ size: 60, unit: 'MB' }"
                :format-response="formatResponse"
                :before-upload="beforeUpload"
                @fail="handleFail"
              >
                <TButton class="form-submit-upload-btn" variant="outline">
                  {{ t('pages.formBase.uploadFile') }}
                </TButton>
              </TUpload>
            </TFormItem>
          </TCol>
        </TRow>

        <div class="form-basic-container-title form-title-gap">
          {{ t('pages.formBase.otherInfo') }}
        </div>

        <TFormItem :label="t('pages.formBase.remark')" name="comment">
          <TTextarea v-model="formData.comment" :height="124" :placeholder="t('pages.formBase.remarkPlaceholder')" />
        </TFormItem>
        <TFormItem :label="t('pages.formBase.notaryPublic')">
          <TAvatarGroup>
            <TAvatar>D</TAvatar>
            <TAvatar>S</TAvatar>
            <TAvatar>+</TAvatar>
          </TAvatarGroup>
        </TFormItem>
      </div>
    </div>

    <div class="form-submit-container">
      <div class="form-submit-sub">
        <div class="form-submit-left">
          <TButton theme="primary" class="form-submit-confirm" type="submit">
            {{ t('pages.formBase.confirm') }}
          </TButton>
          <TButton type="reset" class="form-submit-cancel" theme="default" variant="base">
            {{ t('pages.formBase.cancel') }}
          </TButton>
        </div>
      </div>
    </div>
  </TForm>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
