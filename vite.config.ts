import type { ConfigEnv, UserConfig } from 'vite'

import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
// @ts-expect-error: 忽略 vue 插件的类型错误
import vue from '@vitejs/plugin-vue'
// @ts-expect-error: 忽略 vue-jsx 插件的类型错误
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import svgLoader from 'vite-svg-loader'

const CWD = process.cwd()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX } = loadEnv(mode, CWD)
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
      svgLoader(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        resolvers: [TDesignResolver({
          library: 'vue-next',
        })],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next',
        })],
        dts: 'src/types/components.d.ts',
      }),
      vueJsx(),
      vue(),
    ],
    server: {
      open: false,
      port: 3002,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        [VITE_API_URL_PREFIX]: 'http://127.0.0.1:3000/',
      },
    },
  }
}
