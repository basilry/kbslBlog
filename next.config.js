/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: "/en/post/:detailId(\\d+)", destination: "/ko/post/:detailId", permanent: false },
            { source: "/:locale(ko|en)/login", destination: "/:locale", permanent: true },
            { source: "/:locale(ko|en)/userProfile", destination: "/:locale", permanent: true },
            { source: "/:locale(ko|en)/post/register", destination: "/:locale/post", permanent: true },
            { source: "/login", destination: "/", permanent: true },
            { source: "/userProfile", destination: "/", permanent: true },
            { source: "/post/register", destination: "/post", permanent: true },
        ]
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "drive.google.com" },
            { protocol: "https", hostname: "googleusercontent.com" },
            { protocol: "https", hostname: "**.googleusercontent.com" },
            { protocol: "https", hostname: "api.basilry.kim" },
            ...(process.env.NODE_ENV === "development" ? [{ protocol: "http", hostname: "localhost" }] : []),
        ],
    },
}
module.exports = nextConfig
