/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withExportImages = require("next-export-optimize-images")

const nextConfig = withExportImages({
    output: "export",
    basePath: "/kbslBlog",
    assetPrefix: "/kbslBlog/",
    images: {
        loader: "default",
    },
})

module.exports = nextConfig
