/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: [
            "drive.google.com",
            "lh3.googleusercontent.com",
            "lh4.googleusercontent.com",
            "lh5.googleusercontent.com",
            "lh6.googleusercontent.com",
            "localhost",
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "drive.google.com",
            },
        ],
    },
}

module.exports = nextConfig
