import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
    resolve: {
        alias: {
            "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
            "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@interface": fileURLToPath(new URL("./src/interface", import.meta.url)),
            "@app": fileURLToPath(new URL("./src/app/[locale]", import.meta.url)),
            "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
        },
    },
    test: { environment: "node", exclude: ["**/node_modules/**", ".next/**", "cloudflare/counter-worker/**", "tests/e2e/**"] },
})
