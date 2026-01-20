<script setup lang="ts">
import type { NotificationItem } from '@/types/interface'
import { storeToRefs } from 'pinia'

import { computed, ref } from 'vue'
import EmptyIcon from '@/assets/assets-empty.svg?component'
import { NOTIFICATION_TYPES } from '@/constants'
import { t } from '@/locales'
import { useNotificationStore } from '@/store'

defineOptions({
  name: 'DetailSecondary',
})

const TAB_LIST = [
  {
    label: t('pages.detailSecondary.all'),
    value: 'msgData',
  },
  {
    label: t('pages.detailSecondary.unread'),
    value: 'unreadMsg',
  },
  {
    label: t('pages.detailSecondary.read'),
    value: 'readMsg',
  },
]

const tabValue = ref('msgData')

const visible = ref(false)
const selectedItem = ref<NotificationItem>()

const store = useNotificationStore()
const { msgData, unreadMsg, readMsg } = storeToRefs(store)

const msgDataList = computed(() => {
  if (tabValue.value === 'msgData')
    return msgData.value
  if (tabValue.value === 'unreadMsg')
    return unreadMsg.value
  if (tabValue.value === 'readMsg')
    return readMsg.value
  return []
})

function handleClickDeleteBtn(item: NotificationItem) {
  visible.value = true
  selectedItem.value = item
}

function setReadStatus(item: NotificationItem) {
  const changeMsg = msgData.value
  changeMsg.forEach((e: NotificationItem) => {
    if (e.id === item.id) {
      e.status = !e.status
    }
  })
  store.setMsgData(changeMsg)
}

function deleteMsg() {
  const item = selectedItem.value
  const changeMsg = msgData.value
  changeMsg.forEach((e: NotificationItem, index: number) => {
    if (e.id === item?.id) {
      changeMsg.splice(index, 1)
    }
  })
  visible.value = false
  store.setMsgData(changeMsg)
}
</script>
<template>
  <div>
    <div class="secondary-notification">
      <TTabs v-model="tabValue">
        <TTabPanel v-for="(tab, tabIndex) in TAB_LIST" :key="tabIndex" :value="tab.value" :label="tab.label">
          <TList v-if="msgDataList.length > 0" class="secondary-msg-list" :split="true">
            <TListItem v-for="(item, index) in msgDataList" :key="index">
              <p class="content" :class="[{ unread: item.status }]" @click="setReadStatus(item)">
                <TTag size="medium" :theme="NOTIFICATION_TYPES.get(item.quality)" variant="light">
                  {{ item.type }}
                </TTag>
                {{ item.content }}
              </p>
              <template #action>
                <span class="msg-date">{{ item.date }}</span>

                <div class="msg-action">
                  <TTooltip
                    class="set-read-icon"
                    :overlay-style="{ margin: '6px' }"
                    :content="item.status ? t('pages.detailSecondary.setRead') : t('pages.detailSecondary.setUnread')"
                  >
                    <span class="msg-action-icon" @click="setReadStatus(item)">
                      <TIcon v-if="!!item.status" name="queue" size="16px" />
                      <TIcon v-else name="chat" />
                    </span>
                  </TTooltip>
                  <TTooltip :content="t('pages.detailSecondary.delete')" :overlay-style="{ margin: '6px' }">
                    <span @click="handleClickDeleteBtn(item)">
                      <TIcon name="delete" size="16px" />
                    </span>
                  </TTooltip>
                </div>
              </template>
            </TListItem>
          </TList>
          <div v-else class="secondary-msg-list__empty-list">
            <EmptyIcon />
            <p>{{ t('pages.detailSecondary.empty') }}</p>
          </div>
        </TTabPanel>
      </TTabs>
    </div>
    <TDialog
      v-model:visible="visible"
      header="删除通知"
      :body="`确认删除通知：${selectedItem && selectedItem.content}吗？`"
      :on-confirm="deleteMsg"
    />
  </div>
</template>
<style lang="less" scoped>
@import './index.less';
</style>
