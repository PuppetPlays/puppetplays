import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import cypress from 'eslint-plugin-cypress';
import _import from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    'node_modules/*',
    '.next/*',
    '.out/*',
    'build/*',
    'dist/*',
    'coverage/*',
    '!**/.prettierrc.js',
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/recommended',
        'plugin:prettier/recommended',
      ),
    ),

    plugins: {
      jest,
      cypress,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...jest.environments.globals.globals,
        ...cypress.environments.globals.globals,
      },

      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },

      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'NextLink',
          linkAttribute: 'href',
        },
      ],
    },

    rules: {
      'react/react-in-jsx-scope': 'off',

      'react/prop-types': [
        'error',
        {
          skipUndeclared: true,
        },
      ],

      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      'react/self-closing-comp': 'error',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],

      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
]);
