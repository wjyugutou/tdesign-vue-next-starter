import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'
import useMessage from '@/hooks/useMessage'

export interface CustomMeta {
  /** 是否过滤data */
  original?: true
  /** blob */
  blob?: boolean
  /** 是否隐藏错误提示 */
  hideAlert?: true
}

declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: CustomMeta
  }
}

// 默认只缓存get请求 cacheFor
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_URL_PREFIX,
  timeout: 5000,
  statesHook: vueHook,
  cacheFor: {
    GET: 1000 * 60 * 1, // 1min
    POST: 1000 * 60 * 1, // 1min
  },
  requestAdapter: adapterFetch(),
  beforeRequest: (config) => {
    console.log('beforeRequest', config)
    // const token = localStorage.getItem('token')
    // if (token)
    // config.config.headers.Authorization = `Bearer ${token}`
  },
  responded: {
    onSuccess: async (response, instance) => {
      if (response.status === 200 && response.ok) {
        if (instance.meta?.blob) {
          return {
            data: response.blob(),
            fileName: response.headers.get('content-disposition')?.split('filename=')[1],
          }
        }
        else {
          const res = await response.json()
          if (instance.meta?.original === true) {
            return res
          }
          else {
            console.log(res)

            if (res.code === 200) {
              return res.data
            }
            else {
              if (instance.meta?.hideAlert !== true) {
                useMessage({ type: 'error', msg: res.message })
              }
              console.error(res.message)

              return Promise.reject(res.message)
            }
          }
        }
      }
      else {
        if (instance.meta?.hideAlert !== true) {
          useMessage({ type: 'error', msg: response.statusText })
        }
        console.error(response.statusText)

        return Promise.reject(response.statusText)
      }
    },
    onError: (error, instance) => {
      if (instance.meta?.hideAlert !== true) {
        useMessage({ type: 'error', msg: error.message })
      }
      console.error(error)

      return Promise.reject(error)
    },
  },
})

export default alovaInstance
