<script setup lang="ts">
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import { SearchIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getList } from '@/api/list'
import Trend from '@/components/trend/index.vue'
import { prefix } from '@/config/global'
import { CONTRACT_PAYMENT_TYPES, CONTRACT_STATUS, CONTRACT_TYPES } from '@/constants'
import { t } from '@/locales'
import { useSettingStore } from '@/store'

defineOptions({
  name: 'ListBase',
})

const store = useSettingStore()

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.listBase.contractName'),
    align: 'left',
    width: 320,
    colKey: 'name',
    fixed: 'left',
  },
  { title: t('pages.listBase.contractStatus'), colKey: 'status', width: 160 },
  {
    title: t('pages.listBase.contractNum'),
    width: 160,
    ellipsis: true,
    colKey: 'no',
  },
  {
    title: t('pages.listBase.contractType'),
    width: 160,
    ellipsis: true,
    colKey: 'contractType',
  },
  {
    title: t('pages.listBase.contractPayType'),
    width: 160,
    ellipsis: true,
    colKey: 'paymentType',
  },
  {
    title: t('pages.listBase.contractAmount'),
    width: 160,
    ellipsis: true,
    colKey: 'amount',
  },
  {
    title: t('pages.listBase.operation'),
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
]

const data = ref([])
const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
})

const searchValue = ref('')

const dataLoading = ref(false)
async function fetchData() {
  dataLoading.value = true
  try {
    const { list } = await getList()
    data.value = list
    pagination.value = {
      ...pagination.value,
      total: list.length,
    }
  }
  catch (e) {
    console.log(e)
  }
  finally {
    dataLoading.value = false
  }
}

const deleteIdx = ref(-1)
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = data.value[deleteIdx.value]
    return `删除后，${name}的所有合同信息将被清空，且无法恢复`
  }
  return ''
})

onMounted(() => {
  fetchData()
})

const confirmVisible = ref(false)

const selectedRowKeys = ref<(string | number)[]>([1, 2])

const router = useRouter()

function resetIdx() {
  deleteIdx.value = -1
}

function onConfirmDelete() {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1)
  pagination.value.total = data.value.length
  const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value)
  if (selectedIdx > -1) {
    selectedRowKeys.value.splice(selectedIdx, 1)
  }
  confirmVisible.value = false
  MessagePlugin.success('删除成功')
  resetIdx()
}

function onCancel() {
  resetIdx()
}

const rowKey = 'index'

function rehandleSelectChange(val: (string | number)[]) {
  selectedRowKeys.value = val
}
function rehandlePageChange(curr: unknown, pageInfo: unknown) {
  console.log('分页变化', curr, pageInfo)
}
function rehandleChange(changeParams: unknown, triggerAndData: unknown) {
  console.log('统一Change', changeParams, triggerAndData)
}
function handleClickDetail() {
  router.push('/detail/base')
}
function handleSetupContract() {
  router.push('/form/base')
}
function handleClickDelete(row: { rowIndex: any }) {
  deleteIdx.value = row.rowIndex
  confirmVisible.value = true
}

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
)
</script>
<template>
  <div>
    <TCard class="list-card-container" :bordered="false">
      <TRow justify="space-between">
        <div class="left-operation-container">
          <TButton @click="handleSetupContract">
            {{ t('pages.listBase.create') }}
          </TButton>
          <TButton variant="base" theme="default" :disabled="!selectedRowKeys.length">
            {{ t('pages.listBase.export') }}
          </TButton>
          <p v-if="!!selectedRowKeys.length" class="selected-count">
            {{ t('pages.listBase.select') }} {{ selectedRowKeys.length }} {{ t('pages.listBase.items') }}
          </p>
        </div>
        <div class="search-input">
          <TInput v-model="searchValue" :placeholder="t('pages.listBase.placeholder')" clearable>
            <template #suffix-icon>
              <SearchIcon size="16px" />
            </template>
          </TInput>
        </div>
      </TRow>
      <TTable
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="(value: (string | number)[]) => rehandleSelectChange(value)"
      >
        <template #status="{ row }">
          <TTag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">
            {{ t('pages.listBase.contractStatusEnum.fail') }}
          </TTag>
          <TTag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">
            {{ t('pages.listBase.contractStatusEnum.audit') }}
          </TTag>
          <TTag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">
            {{ t('pages.listBase.contractStatusEnum.pending') }}
          </TTag>
          <TTag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">
            {{ t('pages.listBase.contractStatusEnum.executing') }}
          </TTag>
          <TTag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">
            {{ t('pages.listBase.contractStatusEnum.finish') }}
          </TTag>
        </template>
        <template #contractType="{ row }">
          <p v-if="row.contractType === CONTRACT_TYPES.MAIN">
            {{ t('pages.listBase.contractStatusEnum.fail') }}
          </p>
          <p v-if="row.contractType === CONTRACT_TYPES.SUB">
            {{ t('pages.listBase.contractStatusEnum.audit') }}
          </p>
          <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">
            {{ t('pages.listBase.contractStatusEnum.pending') }}
          </p>
        </template>
        <template #paymentType="{ row }">
          <div v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">
            {{ t('pages.listBase.pay') }}<Trend class="dashboard-item-trend" type="up" />
          </div>
          <div v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECEIPT" class="payment-col">
            {{ t('pages.listBase.receive') }}<Trend class="dashboard-item-trend" type="down" />
          </div>
        </template>

        <template #op="slotProps">
          <TSpace>
            <TLink theme="primary" @click="handleClickDetail()">
              {{ t('pages.listBase.detail') }}
            </TLink>
            <TLink theme="danger" @click="handleClickDelete(slotProps)">
              {{ t('pages.listBase.delete') }}
            </TLink>
          </TSpace>
        </template>
      </TTable>
    </TCard>

    <TDialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>
<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
