import type { MenuListResult } from '@/api/model/permissionModel'
import request from '@/utils/request'

const Api = {
  MenuList: '/get-menu-list-i18n',
}

export function getMenuList() {
  return request.Get<MenuListResult>(Api.MenuList)
}
