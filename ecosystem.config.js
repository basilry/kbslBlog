module.exports = {
    apps: [
        {
            name: "kbslBlog_FE",
            script: "./node_modules/next/dist/bin/next",
            exec_mode: "fork_mode",
            instances: 1,
            max_memory_restart: "300M",
            restart_delay: 3000,
            watch: "true",
        },
    ],
}
