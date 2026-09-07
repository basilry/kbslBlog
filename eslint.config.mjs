import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"

export default defineConfig([
    ...nextVitals,
    ...nextTypescript,
    prettier,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@next/next/no-img-element": "warn",
        },
    },
    globalIgnores([".next/**", ".validation/**", ".content-preview/**", ".content-drafts/**", "cloudflare/counter-worker/**", "out/**", "coverage/**", "next-env.d.ts", "logs/**"]),
])
