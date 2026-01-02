import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  // 1. Ignore
  { ignores: ['node_modules', 'dist'] },

  // 2. Config gốc JS
  js.configs.recommended,

  // 3. Config cho Node.js / Express
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Dùng import/export
      globals: {
        ...globals.node // Import các biến toàn cục của Node (process, __dirname, module...)
      }
    },
    rules: {
      'no-console': 'off', // Backend cho phép log thoải mái
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] // Biến không dùng thì cảnh báo thôi
    }
  },

  // 4. Prettier chốt đơn
  prettier
]