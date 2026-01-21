<script setup lang="ts">
import type { DateRangeValue } from 'tdesign-vue-next'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue'

import ProductAIcon from '@/assets/assets-product-1.svg'
import ProductBIcon from '@/assets/assets-product-2.svg'
import ProductCIcon from '@/assets/assets-product-3.svg'
import ProductDIcon from '@/assets/assets-product-4.svg'
import { t } from '@/locales'
import { useSettingStore } from '@/store'
import { changeChartsTheme } from '@/utils/color'
import { LAST_7_DAYS } from '@/utils/date'

import { PRODUCT_LIST, TEAM_MEMBERS, USER_INFO_LIST } from './constants'
import { getFolderLineDataSet } from './index'

defineOptions({
  name: 'UserIndex',
})

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent])

let lineContainer: HTMLElement
let lineChart: echarts.ECharts
const store = useSettingStore()
const chartColors = computed(() => store.chartColors)

function onLineChange(value: DateRangeValue) {
  lineChart.setOption(
    getFolderLineDataSet({
      dateTime: value as string[],
      ...chartColors.value,
    }),
  )
}

function initChart() {
  lineContainer = document.getElementById('lineContainer')
  lineChart = echarts.init(lineContainer)
  lineChart.setOption({
    grid: {
      x: 30, // 默认是80px
      y: 30, // 默认是60px
      x2: 10, // 默认80px
      y2: 30, // 默认60px
    },
    ...getFolderLineDataSet({ ...chartColors.value }),
  })
}

function updateContainer() {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  })
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', updateContainer, false)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer)
})

function getIcon(type: string) {
  switch (type) {
    case 'a':
      return ProductAIcon
    case 'b':
      return ProductBIcon
    case 'c':
      return ProductCIcon
    case 'd':
      return ProductDIcon
    default:
      return ProductAIcon
  }
}

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart])
  },
)
</script>
<template>
  <TRow :gutter="[24, 24]">
    <TCol :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，Image
          <span class="regular"> 下午好，今天是你加入鹅厂的第 100 天</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo">
      </div>

      <TCard class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <TButton theme="default" shape="square" variant="text">
            <TIcon name="ellipsis" />
          </TButton>
        </template>
        <TDescriptions :column="4" item-layout="vertical">
          <TDescriptionsItem v-for="(item, index) in USER_INFO_LIST" :key="index" :label="t(item.title)">
            {{ item.content }}
          </TDescriptionsItem>
        </TDescriptions>
      </TCard>

      <TCard class="content-container" :bordered="false">
        <TTabs value="second">
          <TTabPanel value="first" label="内容列表">
            <p>内容列表</p>
          </TTabPanel>
          <TTabPanel value="second" label="内容列表">
            <TCard :bordered="false" class="card-padding-no" title="首页访问数据" describe="（次）">
              <template #actions>
                <TDateRangePicker
                  class="card-date-picker-container"
                  :default-value="LAST_7_DAYS"
                  theme="primary"
                  mode="date"
                  @change="onLineChange"
                />
              </template>
              <div id="lineContainer" style="width: 100%; height: 328px" />
            </TCard>
          </TTabPanel>
          <TTabPanel value="third" label="内容列表">
            <p>内容列表</p>
          </TTabPanel>
        </TTabs>
      </TCard>
    </TCol>

    <TCol :flex="1">
      <TCard class="user-intro" :bordered="false">
        <TAvatar size="80px">
          T
        </TAvatar>
        <div class="name">
          My Account
        </div>
        <div class="position">
          港澳业务拓展组员工 直客销售 
        </div>
      </TCard>

      <TCard title="团队成员" class="user-team" :bordered="false">
        <template #actions>
          <TButton theme="default" shape="square" variant="text">
            <TIcon name="ellipsis" />
          </TButton>
        </template>
        <TList :split="false">
          <TListItem v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <TListItemMeta :image="item.avatar" :title="item.title" :description="item.description" />
          </TListItem>
        </TList>
      </TCard>

      <TCard title="服务产品" class="product-container" :bordered="false">
        <template #actions>
          <TButton theme="default" shape="square" variant="text">
            <TIcon name="ellipsis" />
          </TButton>
        </template>
        <TRow class="content" :getters="16">
          <TCol v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)" />
          </TCol>
        </TRow>
      </TCard>
    </TCol>
  </TRow>
</template>
<style lang="less" scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>
