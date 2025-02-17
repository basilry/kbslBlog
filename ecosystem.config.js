module.exports = {
    apps: [
        {
            name: "kbslBlog_FE",
            script: "./node_modules/.bin/next",
            args: "next start -p 3000",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "300M",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
}
