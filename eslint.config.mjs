import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescriptConfig from 'eslint-config-next/typescript';

/** Flat config — `eslint-config-next` udostępnia gotowe zestawy dla ESLint 9. */
const eslintConfig = [
  {
    /**
     * `msdream/` to osobna aplikacja z własnym package.json, tsconfigiem
     * i konfiguracją ESLint-a. Lintujemy ją jej własnymi regułami
     * (`cd msdream && npm run lint`), nie regułami portfolio.
     */
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**', 'msdream/**'],
  },
  ...coreWebVitals,
  ...typescriptConfig,
  {
    /**
     * React Three Fiber działa imperatywnie: pętla `useFrame` z założenia
     * mutuje obiekty sceny (kamerę, materiały, transformacje) między
     * renderami Reacta. Reguły niemutowalności opisują model deklaratywny
     * i w tym katalogu dawałyby wyłącznie fałszywe alarmy.
     */
    files: ['src/components/three/**/*.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Skrypty narzędziowe raportują postęp do konsoli — to ich interfejs.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
];

export default eslintConfig;
