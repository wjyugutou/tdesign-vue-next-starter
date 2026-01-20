<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, onDeactivated, onMounted, watch } from 'vue'

import ProductCard from '@/components/product-card/index.vue'
import Trend from '@/components/trend/index.vue'
import { useSettingStore } from '@/store'
import { changeChartsTheme } from '@/utils/color'
import { LAST_7_DAYS } from '@/utils/date'

import { PANE_LIST_DATA, PRODUCT_LIST } from './constants'
import { getFolderLineDataSet, getScatterDataSet } from './index'

defineOptions({
  name: 'DashboardDetail',
})
echarts.use([GridComponent, LegendComponent, TooltipComponent, LineChart, ScatterChart, CanvasRenderer])

const store = useSettingStore()
const chartColors = computed(() => store.chartColors)

// lineChart logic
let lineContainer: HTMLElement
let lineChart: echarts.ECharts
function renderLineChart() {
  lineContainer = document.getElementById('lineContainer')
  lineChart = echarts.init(lineContainer)
  lineChart.setOption(getFolderLineDataSet({ ...chartColors.value }))
}

// scatterChart logic
let scatterContainer: HTMLElement
let scatterChart: echarts.ECharts
function renderScatterChart() {
  scatterContainer = document.getElementById('scatterContainer')
  scatterChart = echarts.init(scatterContainer)
  scatterChart.setOption(getScatterDataSet({ ...chartColors.value }))
}

// chartSize update
function updateContainer() {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  })
  scatterChart?.resize({
    width: scatterContainer.clientWidth,
    height: scatterContainer.clientHeight,
  })
}

function renderCharts() {
  renderScatterChart()
  renderLineChart()
}

onMounted(() => {
  renderCharts()
  nextTick(() => {
    updateContainer()
  })
})

const { width, height } = useWindowSize()
watch([width, height], () => {
  updateContainer()
})

const storeModeWatch = watch(
  () => store.mode,
  () => {
    renderCharts()
  },
)

const storeBrandThemeWatch = watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart, scatterChart])
  },
)

function onSatisfyChange() {
  scatterChart.setOption(getScatterDataSet({ ...chartColors.value }))
}

function onMaterialChange(value: string[]) {
  const chartColors = computed(() => store.chartColors)
  lineChart.setOption(getFolderLineDataSet({ dateTime: value, ...chartColors.value }))
}

onDeactivated(() => {
  storeModeWatch()
  storeBrandThemeWatch()
})
</script>
<template>
  <div class="dashboard-panel-detail">
    <TCard title="本月采购申请情况" class="dashboard-detail-card" :bordered="false">
      <TRow :gutter="[16, 16]">
        <TCol v-for="(item, index) in PANE_LIST_DATA" :key="index" :xs="6" :xl="3">
          <TCard class="dashboard-list-card" :description="item.title">
            <div class="dashboard-list-card__number">
              {{ item.number }}
            </div>
            <div class="dashboard-list-card__text">
              <div class="dashboard-list-card__text-left">
                环比
                <Trend class="icon" :type="item.upTrend ? 'up' : 'down'" :describe="item.upTrend || item.downTrend" />
              </div>
              <TIcon name="chevron-right" />
            </div>
          </TCard>
        </TCol>
      </TRow>
    </TCard>
    <TRow :gutter="[16, 16]" class="row-margin">
      <TCol :xs="12" :xl="9">
        <TCard title="采购申请趋势" class="dashboard-detail-card" :bordered="false">
          <template #actions>
            <TDateRangePicker
              class="card-date-picker-container"
              :default-value="LAST_7_DAYS"
              theme="primary"
              mode="date"
              style="width: 248px"
              @change="(value) => onMaterialChange(value as string[])"
            />
          </template>
          <div id="lineContainer" style="width: 100%; height: 416px" />
        </TCard>
      </TCol>
      <TCol :xs="12" :xl="3">
        <ProductCard
          v-for="(item, index) in PRODUCT_LIST"
          :key="index"
          :product="item"
          class="product-card"
          :class="{ 'row-margin': index !== 0 }"
        />
      </TCol>
    </TRow>
    <TCard
      class="dashboard-detail-card row-margin"
      title="采购申请满意度"
      :bordered="false"
    >
      <template #actions>
        <TDateRangePicker
          class="card-date-picker-container"
          :default-value="LAST_7_DAYS"
          theme="primary"
          mode="date"
          style="display: inline-block; margin-right: var(--td-comp-margin-s); width: 248px"
          @change="onSatisfyChange"
        />
        <TButton class="card-date-button">
          导出
        </TButton>
      </template>
      <div id="scatterContainer" style="width: 100%; height: 434px" />
    </TCard>
  </div>
</template>
<style lang="less" scoped>
.row-margin {
  margin-top: 16px;
}

.product-card {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__footer) {
    padding: 0;
  }
}

/* 统一增加8px */
.dashboard-detail-card {
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

  :deep(.t-card__actions) {
    display: flex;
    align-items: center;
  }
}

.dashboard-list-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);

  :deep(.t-card__description) {
    margin: 0;
  }

  :deep(.t-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: var(--td-comp-margin-s);
  }

  &.dark {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &.light {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &__number {
    font-size: var(--td-font-size-headline-medium);
    line-height: var(--td-font-size-headline-medium);
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-placeholder);
    text-align: left;

    .t-icon {
      font-size: var(--td-comp-size-xxxs);
    }

    &-left {
      display: flex;

      .icon {
        margin: 0 var(--td-comp-margin-s);
      }
    }
  }
}
</style>
