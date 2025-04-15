// eslint.config.mjs
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**', 'src/js/**/*.js'],
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      globals: {
        window: true,
        document: true,
        console: true,
        fetch: true,
        Response: true,
        Request: true,
        RequestInit: true,
        Headers: true
      }
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-const': 'error',
      'no-throw-literal': 'error'
    },
  },
];




