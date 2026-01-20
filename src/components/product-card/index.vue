<script setup lang="ts">
import type { PropType } from 'vue'
import {
  AddIcon,
  CalendarIcon,
  LaptopIcon,
  MoreIcon,
  ServiceIcon,
  ShopIcon,
  UserAvatarIcon,
} from 'tdesign-icons-vue-next'

import { t } from '@/locales'

export interface CardProductType {
  type: number
  isSetup: boolean
  description: string
  name: string
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>,
    default: undefined,
  },
})

const emit = defineEmits(['manage-product', 'delete-item'])

const typeMap = ['A', 'B', 'C', 'D', 'E']

function handleClickManage(product: CardProductType) {
  emit('manage-product', product)
}

function handleClickDelete(product: CardProductType) {
  emit('delete-item', product)
}
</script>
<template>
  <TCard theme="poster2" :bordered="false">
    <template #avatar>
      <TAvatar size="56px">
        <template #icon>
          <ShopIcon v-if="props.product.type === 1" />
          <CalendarIcon v-if="props.product.type === 2" />
          <ServiceIcon v-if="props.product.type === 3" />
          <UserAvatarIcon v-if="props.product.type === 4" />
          <LaptopIcon v-if="props.product.type === 5" />
        </template>
      </TAvatar>
    </template>
    <template #status>
      <TTag :theme="props.product.isSetup ? 'success' : 'default'" :disabled="!props.product.isSetup">
        {{ props.product.isSetup ? t('components.isSetup.on') : t('components.isSetup.off') }}
      </TTag>
    </template>
    <template #content>
      <p class="list-card-item_detail--name">
        {{ props.product.name }}
      </p>
      <p class="list-card-item_detail--desc">
        {{ props.product.description }}
      </p>
    </template>
    <template #footer>
      <TAvatarGroup cascading="left-up" :max="2">
        <TAvatar>{{ typeMap[product.type - 1] }}</TAvatar>
        <TAvatar>
          <template #icon>
            <AddIcon />
          </template>
        </TAvatar>
      </TAvatarGroup>
    </template>
    <template #actions>
      <TDropdown
        :disabled="!props.product.isSetup"
        trigger="click"
        :options="[
          {
            content: t('components.manage'),
            value: 'manage',
            onClick: () => handleClickManage(props.product),
          },
          {
            content: t('components.delete'),
            value: 'delete',
            onClick: () => handleClickDelete(props.product),
          },
        ]"
      >
        <TButton theme="default" :disabled="!props.product.isSetup" shape="square" variant="text">
          <MoreIcon />
        </TButton>
      </TDropdown>
    </template>
  </TCard>
</template>
<style lang="less" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &_detail {
    min-height: 140px;

    &--name {
      margin-bottom: var(--td-comp-margin-s);
      font: var(--td-font-title-medium);
      color: var(--td-text-color-primary);
    }

    &--desc {
      color: var(--td-text-color-secondary);
      font: var(--td-font-body-small);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
