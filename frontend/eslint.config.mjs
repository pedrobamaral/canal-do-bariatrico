import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // regras personalizadas para o codigo
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      //imports ordenados automaticamente
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // remove imports não usados automaticamente (quando possível)
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
      // sem console.log (warn e error)
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // warning sobre o uso de 'any'
      "@typescript-eslint/no-explicit-any": "warn",

      // aviso de variaveis nao utilizadas
      "@typescript-eslint/no-unused-vars": "warn"
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
