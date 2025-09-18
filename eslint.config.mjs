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
      // Change @typescript-eslint/no-explicit-any from error to warning
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Change @typescript-eslint/no-unused-vars from error to warning
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // Change react/display-name from error to warning
      'react/display-name': 'warn',
      
      // Change react-hooks/exhaustive-deps from error to warning
      'react-hooks/exhaustive-deps': 'warn',
      
      // Disable some overly strict rules
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];

export default eslintConfig;
