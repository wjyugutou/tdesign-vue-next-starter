import antfu from '@antfu/eslint-config';

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
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/block-order': [
          'error',
          {
            order: ['template', 'script', 'style'],
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

        'vue-scoped-css/no-parsing-error': 'off',
        'vue-scoped-css/no-unused-selector': 'off',
        'vue-scoped-css/enforce-style-type': [
          'error',
          {
            allows: ['scoped'],
          },
        ],
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
);
