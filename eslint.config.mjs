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
    files: ["src/original-landing/**/*", "src/components/**/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/ban-types": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  {
    files: ["src/app/**/*"],
    rules: {
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  {
    files: ["src/lib/**/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

export default eslintConfig;
