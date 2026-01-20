<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getPurchaseList } from '@/api/detail'
import { t } from '@/locales'

import Product from './components/Product.vue'
import { BASE_INFO_DATA, PRODUCT_LIST } from './constants'

defineOptions({
  name: 'DetailAdvanced',
})

const columns = [
  {
    width: 280,
    ellipsis: true,
    colKey: 'index',
    title: t('pages.detailCard.detail.form.applyNo'),
    sorter: (a: any, b: any) => a.index.substr(3) - b.index.substr(3),
  },
  {
    width: 200,
    ellipsis: true,
    colKey: 'pdName',
    title: t('pages.detailCard.detail.form.product'),
    sorter: (a: any, b: any) => a.pdName.length - b.pdName.length,
  },
  {
    width: 200,
    ellipsis: true,
    colKey: 'pdNum',
    title: t('pages.detailCard.detail.form.productNo'),
  },
  {
    width: 160,
    ellipsis: true,
    colKey: 'purchaseNum',
    title: t('pages.detailCard.detail.form.num'),
    sorter: (a: any, b: any) => a.purchaseNum - b.purchaseNum,
  },
  {
    width: 160,
    ellipsis: true,
    colKey: 'adminName',
    title: t('pages.detailCard.detail.form.department'),
  },
  {
    width: 200,
    ellipsis: true,
    colKey: 'updateTime',
    title: t('pages.detailCard.detail.form.createTime'),
    sorter: (a: any, b: any) => Date.parse(a.updateTime) - Date.parse(b.updateTime),
  },
  {
    align: 'left' as const,
    fixed: 'right' as const,
    width: 200,
    className: 'test2',
    colKey: 'op',
    title: t('pages.detailCard.detail.form.operation'),
  },
]

const data = ref([])
const pagination = ref({
  defaultPageSize: 10,
  total: 100,
  defaultCurrent: 1,
})

const updateCurrent = ref(0)

function stepUpdate() {
  setInterval(() => {
    if (updateCurrent.value > 5) {
      updateCurrent.value = -1
    }
    updateCurrent.value += 1
  }, 2000)
}

async function fetchData() {
  try {
    const { list } = await getPurchaseList()
    data.value = list
    pagination.value = {
      ...pagination.value,
      total: list.length,
    }
  }
  catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  stepUpdate()
  fetchData()
})

const visible = ref(false)
function sortChange(val: unknown) {
  console.log(val)
}
function rehandleChange(changeParams: unknown, triggerAndData: unknown) {
  console.log('统一Change', changeParams, triggerAndData)
}
function listClick() {
  visible.value = true
}
function deleteClickOp(columns: { rowIndex: number }) {
  data.value.splice(columns.rowIndex, 1)
}
function onConfirm() {
  visible.value = false
}
</script>
<template>
  <div class="detail-advanced">
    <TCard :bordered="false">
      <TDescriptions :title="t('pages.detailCard.baseInfo.title')">
        <TDescriptionsItem v-for="(item, index) in BASE_INFO_DATA" :key="index" :label="item.name">
          <span
            :class="{
              ['inProgress']: item.type && item.type.value === 'inProgress',
              ['pdf']: item.type && item.type.value === 'pdf',
            }"
          >
            <i v-if="item.type && item.type.key === 'contractStatus'" />
            {{ item.value }}
          </span>
        </TDescriptionsItem>
      </TDescriptions>
    </TCard>

    <!-- 发票进度 -->
    <TCard :title="t('pages.detailCard.invoice.title')" class="container-base-margin-top" :bordered="false">
      <TRow justify="space-between">
        <TSteps :current="updateCurrent">
          <TStepItem
            :title="t('pages.detailCard.invoice.step1.title')"
            :content="t('pages.detailCard.invoice.step1.content')"
          />
          <TStepItem
            :title="t('pages.detailCard.invoice.step2.title')"
            :content="t('pages.detailCard.invoice.step2.content')"
          />
          <TStepItem
            :title="t('pages.detailCard.invoice.step3.title')"
            :content="t('pages.detailCard.invoice.step3.content')"
          />
          <TStepItem :title="t('pages.detailCard.invoice.step4.title')" />
        </TSteps>
      </TRow>
    </TCard>

    <!-- 产品目录 -->
    <TCard :title="t('pages.detailCard.product.title')" class="container-base-margin-top" :bordered="false">
      <template #actions>
        <TRadioGroup default-value="dateVal">
          <TRadioButton value="dateVal">
            {{ t('pages.detailCard.product.quarter') }}
          </TRadioButton>
          <TRadioButton value="monthVal">
            {{ t('pages.detailCard.product.month') }}
          </TRadioButton>
        </TRadioGroup>
      </template>
      <TRow :gutter="16" class="product-block-container">
        <TCol :xl="4">
          <div class="product-add">
            <div class="product-sub">
              <TIcon name="add" class="product-sub-icon" />
              <span>{{ t('pages.detailCard.product.add') }}</span>
            </div>
          </div>
        </TCol>
        <TCol v-for="(item, index) in PRODUCT_LIST" :key="index" :xl="4">
          <Product :data="item" />
        </TCol>
      </TRow>
    </TCard>

    <!-- 产品采购明细 -->
    <TCard :title="t('pages.detailCard.detail.title')" class="container-base-margin-top" :bordered="false">
      <TTable
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :hover="true"
        :stripe="true"
        row-key="index"
        size="large"
        @sort-change="sortChange"
        @change="rehandleChange"
      >
        <template #pdName="{ row }">
          <span>
            {{ row.pdName }}
            <TTag v-if="row.pdType" size="medium" style="margin-left: var(--td-comp-margin-s)">{{ row.pdType }}</TTag>
          </span>
        </template>

        <template #purchaseNum="{ row }">
          <span>
            {{ row.purchaseNum }}
            <TTag
              v-if="row.purchaseNum > 50"
              theme="danger"
              variant="light"
              size="medium"
              style="margin-left: var(--td-comp-margin-s)"
            >超预算</TTag>
          </span>
        </template>

        <template #op="slotProps">
          <TSpace>
            <TLink theme="primary" @click="listClick()">
              {{ t('pages.detailCard.detail.form.manage') }}
            </TLink>
            <TLink theme="danger" @click="deleteClickOp(slotProps)">
              {{
                t('pages.detailCard.detail.form.delete')
              }}
            </TLink>
          </TSpace>
        </template>

        <template #op-column>
          <TIcon name="descending-order" />
        </template>
      </TTable>
    </TCard>

    <TDialog v-model:visible="visible" :header="t('pages.detailCard.baseInfo.title')" @confirm="onConfirm">
      <template #body>
        <div class="dialog-info-block">
          <TDescriptions :column="1">
            <TDescriptionsItem v-for="(item, index) in BASE_INFO_DATA" :key="index" :label="item.name">
              <span
                :class="{
                  ['inProgress']: item.type && item.type.value === 'inProgress',
                  ['pdf']: item.type && item.type.value === 'pdf',
                }"
              >
                <i v-if="item.type && item.type.key === 'contractStatus'" />
                {{ item.value }}
              </span>
            </TDescriptionsItem>
          </TDescriptions>
        </div>
      </template>
    </TDialog>
  </div>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
