module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',     // 未使用的變數提醒而不報錯
    'linebreak-style': 0,         // 解決 Windows / Unix 換行差異
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single'], // 使用單引號但允許雙引號
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
  },
};