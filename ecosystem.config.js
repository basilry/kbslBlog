module.exports = {
    apps: [
        {
            name: "kbslBlog_FE",
            script: "./node_modules/next/dist/bin/next",
            exec_mode: "fork_mode",
            instances: 1,
            watch: "true",
        },
    ],
}
