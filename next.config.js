/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
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
