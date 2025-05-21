import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/ban-ts-comment': 'off', // This allows @ts-ignore comments
      '@typescript-eslint/no-explicit-any': 'off', // If you're using 'any' types
      '@typescript-eslint/no-unsafe-assignment': 'off', // For type assignment issues
      '@typescript-eslint/no-unsafe-member-access': 'off', // For member access issues
    },
  },
  {
    // Specifically for TypeScript files
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn', // Make it warn instead of error
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
  },
];

export default eslintConfig;
