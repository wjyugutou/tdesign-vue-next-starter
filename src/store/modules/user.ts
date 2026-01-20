import type { UserInfo } from '@/types/interface'
import { usePermissionStore } from '@/store'

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
}

export const useUserStore = defineStore('user', () => {
  const token = ref('main_token') // 默认token不走权限
  const userInfo = ref<UserInfo>({ ...InitUserInfo })

  const roles = computed(() => userInfo.value?.roles || [])

  async function login(userInfo: Record<string, unknown>) {
    const mockLogin = async (userInfo: Record<string, unknown>) => {
      // 登录请求流程
      console.log(`用户信息:`, userInfo)
      return {
        code: 200,
        message: '登录成功',
        data: 'main_token',
      }
    }

    const res = await mockLogin(userInfo)
    if (res.code === 200) {
      token.value = res.data
    }
    else {
      throw res
    }
  }

  async function getUserInfo() {
    const mockRemoteUserInfo = async (token: string) => {
      if (token === 'main_token') {
        return {
          name: 'Tencent',
          roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        }
      }
      return {
        name: 'td_dev',
        roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      }
    }
    const res = await mockRemoteUserInfo(token.value)
    userInfo.value = res
  }

  async function logout() {
    token.value = ''
    userInfo.value = { ...InitUserInfo }
  }

  return {
    token,
    userInfo,
    roles,
    login,
    getUserInfo,
    logout,
  }
}, {
  persist: {
    afterHydrate: () => {
      const permissionStore = usePermissionStore()
      permissionStore.initRoutes()
    },
    key: 'user',
    pick: ['token'],
  },
})
