import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
  // 1. Bỏ qua các folder build
  { ignores: ['dist'] },

  // 2. Config chuẩn của JS
  js.configs.recommended,

  // 3. Config chuẩn của React (Tự cấu hình thủ công cho Flat Config)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    // Khai báo các plugins sẽ dùng
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    // Cài đặt version React để plugin không báo warning
    settings: {
      react: { version: 'detect' }
    },
    // Luật lệ (Rules)
    rules: {
      // Merge rule gốc của các plugin
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // React 17+ không cần import React
      ...reactHooks.configs.recommended.rules,

      // Luật riêng của Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      // Luật Custom của Dex
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // Đổi error thành warn cho đỡ đỏ lòm
      'react/prop-types': 'off', // Tắt check prop-types (nếu cậu lười viết type)
      'react/no-unescaped-entities': 'off' // Cho phép dùng ' " thoải mái trong thẻ
    }
  },

  // 4. CHỐT HẠ: Prettier (Luôn để cuối cùng để đè tất cả format rule)
  prettier
]