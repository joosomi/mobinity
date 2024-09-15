module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'func-style': ['error', 'expression'],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'] },
      { selector: 'property', format: ['camelCase'] },
      { selector: 'class', format: ['PascalCase'] },
      { selector: 'classMethod', format: ['camelCase'] },
      { selector: 'objectLiteralMethod', format: ['camelCase'] },
      {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE'],
      },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ], // 함수의 반환 타입 명시
    '@typescript-eslint/no-explicit-any': 'error', // any 사용시 경고
    'no-else-return': 'warn',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.constants.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
          },
        ],
      },
    },
    {
      files: ['**/*.decorator.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase'],
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
