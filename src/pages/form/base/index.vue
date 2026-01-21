<script setup lang="ts">
import type { SubmitContext, UploadFailContext, UploadFile } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

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
          合同信息
        </div>
        <!-- 表单内容 -->

        <!-- 合同名称,合同类型 -->
        <TRow class="row-gap" :gutter="[32, 24]">
          <TCol :span="6">
            <TFormItem label="合同名称" name="name">
              <TInput v-model="formData.name" :style="{ width: '322px' }" placeholder="请输入内容" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="合同类型" name="type">
              <TSelect v-model="formData.type" :style="{ width: '322px' }" class="demo-select-base" clearable>
                <TOption v-for="(item, index) in TYPE_OPTIONS" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>

          <!-- 合同收付类型 -->
          <TCol :span="8">
            <TFormItem label="合同收支类型" name="payment">
              <TRadioGroup v-model="formData.payment">
                <TRadio value="1">
                  收款
                </TRadio>
                <TRadio value="2">
                  付款
                </TRadio>
              </TRadioGroup>
              <span class="space-item" />
              <div>
                <TInput placeholder="请输入金额" :style="{ width: '160px' }" />
              </div>
            </TFormItem>
          </TCol>

          <TCol :span="6">
            <TFormItem label="甲方" name="partyA">
              <TSelect
                v-model="formData.partyA"
                :style="{ width: '322px' }"
                class="demo-select-base"
                placeholder="请输入类型"
                clearable
              >
                <TOption v-for="(item, index) in PARTY_A_OPTIONS" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="乙方" name="partyB">
              <TSelect
                v-model="formData.partyB"
                :style="{ width: '322px' }"
                placeholder="请输入类型"
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
            <TFormItem label="合同签订日期" name="signDate">
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
            <TFormItem label="合同生效日期" name="startDate">
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
            <TFormItem label="合同结束日期" name="endDate">
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
            <TFormItem label="上传文件" name="files">
              <TUpload
                v-model="formData.files"
                action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                tips="请上传pdf文件，大小在60M以内"
                :size-limit="{ size: 60, unit: 'MB' }"
                :format-response="formatResponse"
                :before-upload="beforeUpload"
                @fail="handleFail"
              >
                <TButton class="form-submit-upload-btn" variant="outline">
                  上传合同
                </TButton>
              </TUpload>
            </TFormItem>
          </TCol>
        </TRow>

        <div class="form-basic-container-title form-title-gap">
          其他信息
        </div>

        <TFormItem label="备注" name="comment">
          <TTextarea v-model="formData.comment" :height="124" placeholder="请输入备注" />
        </TFormItem>
        <TFormItem label="公证人">
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
            确认提交
          </TButton>
          <TButton type="reset" class="form-submit-cancel" theme="default" variant="base">
            取消
          </TButton>
        </div>
      </div>
    </div>
  </TForm>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
