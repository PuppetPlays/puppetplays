module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    'jest/globals': true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [
    'node_modules/*',
    '.next/*',
    '.out/*',
    'build/*',
    'dist/*',
    'coverage/*',
    '!.prettierrc.js',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jest', 'cypress', 'import'],
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
      { name: 'Link', linkAttribute: 'to' },
      { name: 'NextLink', linkAttribute: 'href' },
    ],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': ['error', { skipUndeclared: true }],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
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
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
};
