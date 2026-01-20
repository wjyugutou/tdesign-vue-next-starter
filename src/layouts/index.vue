<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { prefix } from '@/config/global'

import { useSettingStore, useTabsRouterStore } from '@/store'
import LayoutContent from './components/LayoutContent.vue'

import LayoutHeader from './components/LayoutHeader.vue'
import LayoutSideNav from './components/LayoutSideNav.vue'
import SettingCom from './setting.vue'
import '@/style/layout.less'

const route = useRoute()
const settingStore = useSettingStore()
const tabsRouterStore = useTabsRouterStore()
const setting = storeToRefs(settingStore)

const mainLayoutCls = computed(() => [
  {
    't-layout--with-sider': settingStore.showSidebar,
  },
])

function appendNewRoute() {
  const {
    path,
    query,
    meta: { title },
    name,
  } = route
  tabsRouterStore.appendTabRouterList({ path, query, title: title as string, name, isAlive: true, meta: route.meta })
}

onMounted(() => {
  appendNewRoute()
})

watch(
  () => route.path,
  () => {
    appendNewRoute()
    document.querySelector(`.${prefix}-layout`).scrollTo({ top: 0, behavior: 'smooth' })
  },
)
</script>
<template>
  <div>
    <template v-if="setting.layout.value === 'side'">
      <TLayout key="side" :class="mainLayoutCls">
        <TAside><LayoutSideNav /></TAside>
        <TLayout>
          <THeader><LayoutHeader /></THeader>
          <TContent><LayoutContent /></TContent>
        </TLayout>
      </TLayout>
    </template>

    <template v-else>
      <TLayout key="no-side">
        <THeader><LayoutHeader /> </THeader>
        <TLayout :class="mainLayoutCls">
          <LayoutSideNav />
          <LayoutContent />
        </TLayout>
      </TLayout>
    </template>
    <SettingCom />
  </div>
</template>
<style lang="less" scoped></style>
