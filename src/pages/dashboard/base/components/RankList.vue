<script setup lang="ts">
import type { TdBaseTableProps } from 'tdesign-vue-next'

import Trend from '@/components/trend/index.vue'

import { BUY_TEND_LIST, SALE_TEND_LIST } from '../constants'

const SALE_COLUMNS: TdBaseTableProps['columns'] = [
  {
    align: 'center',
    colKey: 'index',
    title: '排名',
    width: 70,
    fixed: 'left',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'productName',
    title: '商品名称',
    width: 150,
  },
  {
    align: 'center',
    colKey: 'growUp',
    width: 70,
    title: '增长',
  },
  {
    align: 'center',
    colKey: 'count',
    title: '销售量',
    width: 70,
  },
  {
    align: 'center',
    colKey: 'operation',
    title: '操作',
    width: 70,
    fixed: 'right',
  },
]

const BUY_COLUMNS: TdBaseTableProps['columns'] = [
  {
    align: 'center',
    colKey: 'index',
    title: '排名',
    width: 70,
    fixed: 'left',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'productName',
    width: 150,
    title: '商品名称',
  },
  {
    align: 'center',
    colKey: 'growUp',
    width: 70,
    title: '增长',
  },
  {
    align: 'center',
    colKey: 'count',
    title: '购买量',
    width: 70,
  },
  {
    align: 'center',
    colKey: 'operation',
    title: '操作',
    width: 70,
    fixed: 'right',
  },
]

function rehandleClickOp(val: MouseEvent) {
  console.log(val)
}
function getRankClass(index: number) {
  return ['dashboard-rank', { 'dashboard-rank__top': index < 3 }]
}
</script>
<template>
  <TRow :gutter="16" class="row-container">
    <TCol :xs="12" :xl="6">
      <TCard title="销售排名" class="dashboard-rank-card" :bordered="false">
        <template #actions>
          <TRadioGroup default-value="dateVal" variant="default-filled">
            <TRadioButton value="dateVal">
              本周
            </TRadioButton>
            <TRadioButton value="monthVal">
              本月
            </TRadioButton>
          </TRadioGroup>
        </template>
        <TTable :data="SALE_TEND_LIST" :columns="SALE_COLUMNS" row-key="productName">
          <template #index="{ rowIndex }">
            <span :class="getRankClass(rowIndex)">
              {{ rowIndex + 1 }}
            </span>
          </template>
          <template #growUp="{ row }">
            <span>
              <Trend :type="row.growUp > 0 ? 'up' : 'down'" :describe="Math.abs(row.growUp)" />
            </span>
          </template>
          <template #operation="slotProps">
            <TLink theme="primary" @click="rehandleClickOp(slotProps)">
              查看详情
            </TLink>
          </template>
        </TTable>
      </TCard>
    </TCol>
    <TCol :xs="12" :xl="6">
      <TCard title="购买排名" class="dashboard-rank-card" :bordered="false">
        <template #actions>
          <TRadioGroup default-value="dateVal" variant="default-filled">
            <TRadioButton value="dateVal">
              本周
            </TRadioButton>
            <TRadioButton value="monthVal">
              本月
            </TRadioButton>
          </TRadioGroup>
        </template>
        <TTable :data="BUY_TEND_LIST" :columns="BUY_COLUMNS" row-key="productName">
          <template #index="{ rowIndex }">
            <span :class="getRankClass(rowIndex)">
              {{ rowIndex + 1 }}
            </span>
          </template>
          <template #growUp="{ row }">
            <Trend :type="row.growUp > 0 ? 'up' : 'down'" :describe="Math.abs(row.growUp)" />
          </template>
          <template #operation="slotProps">
            <TLink theme="primary" @click="rehandleClickOp(slotProps)">
              查看详情
            </TLink>
          </template>
        </TTable>
      </TCard>
    </TCol>
  </TRow>
</template>
<style lang="less" scoped>
.dashboard-rank-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }
}

.dashboard-rank__cell {
  display: inline-flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  background-color: var(--td-gray-color-5);
  align-items: center;
  justify-content: center;
  font-weight: 700;

  &--top {
    background: var(--td-brand-color);
  }
}
</style>
