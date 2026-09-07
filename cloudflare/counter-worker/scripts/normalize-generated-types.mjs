import { readFile, writeFile } from "node:fs/promises"

const path = new URL("../worker-configuration.d.ts", import.meta.url)
const source = await readFile(path, "utf8")
const normalized = source.replace(/[ \t]+$/gm, "").replace(/\r\n/g, "\n")
await writeFile(path, normalized)
