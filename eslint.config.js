import antfu from '@antfu/eslint-config'
import { globalIgnores } from 'eslint/config'

export default antfu(
  {
    typescript: true,
    vue: true,
    jsonc: false,
    yaml: false,
    markdown: false,
    formatters: false,
  },
  [
    {
      files: ['**/*.vue'],
      rules: {
        // 组件名称 书写方式 自动修复为PascalCase
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          {
          // 为false检查全部组件，true 检查注册组件（对unplugin-vue-components无效），
            registeredComponentsOnly: false,
            ignores: [],
          },
        ],
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/block-lang': [
          'error',
          {
            script: {
              lang: ['ts', 'tsx'],
            },
          },
        ],
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-props': 'off',
        'vue/no-v-html': 'off',

        'vue/padding-line-between-blocks': ['error', 'never'],
      },
    },
    globalIgnores([
      '**/snapshot*',
      '**/dist',
      '**/lib',
      '**/es',
      '**/esm',
      '**/node_modules',
      'src/_common',
      '**/static',
      '**/cypress',
      'script/test/cypress',
      '**/_site',
      '**/temp*',
      '**/static/',
      '!**/.prettierrc.js',
    ]),
  ],
  {
    rules: {
      'no-console': 'off',
    },
  },
)
