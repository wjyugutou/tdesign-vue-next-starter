/**
 * 消息提示 Hook
 * 基于 TDesign MessagePlugin 的封装
 *
 * @example
 * useMessage({
 *   msg: 'hello',
 *   type: 'success',
 * })
 */

import { MessagePlugin } from 'tdesign-vue-next'

export interface MessageOptions {
  /** 消息内容 */
  msg?: string
  /** 消息类型: success, error, warning, info, question, loading */
  type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading'
  /** 显示时长(ms)，0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closeBtn?: boolean
}

export interface MessageReturn {
  /** 关闭消息函数，closeAll=true 时关闭所有消息 */
  close: (closeAll?: boolean) => void
}

/**
 * 统一的消息提示方法
 * @param options 消息配置
 * @returns 返回包含 close 方法的对象
 */
export function useMessage(options: MessageOptions): MessageReturn {
  const { msg, type = 'info', duration = 3000, closeBtn = false } = options
  const message = msg || ''

  if (!message) {
    console.warn('useMessage: msg is required')
    return {
      close: (closeAll?: boolean) => {
        if (closeAll) {
          MessagePlugin.closeAll()
        }
      },
    }
  }

  const messageConfig = {
    content: message,
    duration,
    closeBtn,
  }

  let messageInstance: any

  switch (type) {
    case 'success':
      messageInstance = MessagePlugin.success(messageConfig)
      break
    case 'error':
      messageInstance = MessagePlugin.error(messageConfig)
      break
    case 'warning':
      messageInstance = MessagePlugin.warning(messageConfig)
      break
    case 'info':
      messageInstance = MessagePlugin.info(messageConfig)
      break
    case 'question':
      messageInstance = MessagePlugin.question(messageConfig)
      break
    case 'loading':
      messageInstance = MessagePlugin.loading(messageConfig)
      break
    default:
      messageInstance = MessagePlugin.info(messageConfig)
  }

  return {
    close: (closeAll?: boolean) => {
      if (closeAll) {
        MessagePlugin.closeAll()
      }
      else if (messageInstance) {
        messageInstance.close()
      }
    },
  }
}

export default useMessage
