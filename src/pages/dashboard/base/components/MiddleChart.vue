<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

import { useSettingStore } from '@/store'
import { changeChartsTheme } from '@/utils/color'
import { LAST_7_DAYS } from '@/utils/date'

import { getLineChartDataSet, getPieChartDataSet } from '../index'

echarts.use([TooltipComponent, LegendComponent, PieChart, GridComponent, LineChart, CanvasRenderer])

function getThisMonth(checkedValues?: string[]) {
  let date: Date
  if (!checkedValues || checkedValues.length === 0) {
    date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1}`
  }
  date = new Date(checkedValues[0])
  const date2 = new Date(checkedValues[1])

  const startMonth = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const endMonth = date2.getMonth() + 1 > 9 ? date2.getMonth() + 1 : `0${date2.getMonth() + 1}`
  return `${date.getFullYear()}-${startMonth}  至  ${date2.getFullYear()}-${endMonth}`
}

const store = useSettingStore()
const resizeTime = ref(1)

const chartColors = computed(() => store.chartColors)

// monitorChart
let monitorContainer: HTMLElement
let monitorChart: echarts.ECharts
function renderMonitorChart() {
  if (!monitorContainer) {
    monitorContainer = document.getElementById('monitorContainer')
  }
  monitorChart = echarts.init(monitorContainer)
  monitorChart.setOption(getLineChartDataSet({ ...chartColors.value }))
}

// monitorChart
let countContainer: HTMLElement
let countChart: echarts.ECharts
function renderCountChart() {
  if (!countContainer) {
    countContainer = document.getElementById('countContainer')
  }
  countChart = echarts.init(countContainer)
  countChart.setOption(getPieChartDataSet(chartColors.value))

  // 取消之前高亮的图形
  countChart.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: -1,
  })
  // 高亮当前图形
  countChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 1,
  })
  // 显示 tooltip
  countChart.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: 1,
  })
}

function renderCharts() {
  renderMonitorChart()
  renderCountChart()
}

// chartSize update
function updateContainer() {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime.value = Number((document.documentElement.clientWidth / 2080).toFixed(2))
  }
  else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number((document.documentElement.clientWidth / 1080).toFixed(2))
  }
  else {
    resizeTime.value = 1
  }

  monitorChart.resize({
    width: monitorContainer.clientWidth,
    height: resizeTime.value * 326,
  })
  countChart.resize({
    width: resizeTime.value * 326,
    height: resizeTime.value * 326,
  })
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

const currentMonth = ref(getThisMonth())

const storeBrandThemeWatch = watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([monitorChart, countChart])
  },
)

const storeSidebarCompactWatch = watch(
  () => store.isSidebarCompact,
  () => {
    if (store.isSidebarCompact) {
      nextTick(() => {
        updateContainer()
      })
    }
    else {
      setTimeout(() => {
        updateContainer()
      }, 180)
    }
  },
)

const storeModeWatch = watch(
  () => store.mode,
  () => {
    [monitorChart, countChart].forEach((item) => {
      item.dispose()
    })

    renderCharts()
  },
)

function onCurrencyChange(checkedValues: string[]) {
  currentMonth.value = getThisMonth(checkedValues)
  monitorChart.setOption(getLineChartDataSet({ dateTime: checkedValues, ...chartColors.value }))
}

onDeactivated(() => {
  storeModeWatch()
  storeBrandThemeWatch()
  storeSidebarCompactWatch()
})
</script>
<template>
  <TRow :gutter="16" class="row-container">
    <TCol :xs="12" :xl="9">
      <TCard
        title="销售分析"
        :subtitle="currentMonth"
        class="dashboard-chart-card"
        :bordered="false"
      >
        <template #actions>
          <div class="dashboard-chart-title-container">
            <TDateRangePicker
              class="card-date-picker-container"
              theme="primary"
              mode="date"
              :default-value="LAST_7_DAYS"
              @change="(value) => onCurrencyChange(value as string[])"
            />
          </div>
        </template>
        <div
          id="monitorContainer"
          class="dashboard-chart-container"
          :style="{ width: '100%', height: `${resizeTime * 326}px` }"
        />
      </TCard>
    </TCol>
    <TCol :xs="12" :xl="3">
      <TCard
        title="渠道分析"
        :subtitle="currentMonth"
        class="dashboard-chart-card"
        :bordered="false"
      >
        <div
          id="countContainer"
          class="dashboard-chart-container"
          :style="{ width: `${resizeTime * 326}px`, height: `${resizeTime * 326}px`, margin: '0 auto' }"
        />
      </TCard>
    </TCol>
  </TRow>
</template>
<style lang="less" scoped>
.dashboard-chart-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }
}
</style>
