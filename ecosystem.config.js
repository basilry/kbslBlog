module.exports = {
    apps: [
        {
            name: "kbslBlog_FE",
            script: "./node_modules/next/dist/bin/next",
            instances: 1,
            args: "start",
            max_memory_restart: "300M",
            restart_delay: 3000,
            error_file: "./logs/err.log", // 에러 로그 파일 경로
            out_file: "./logs/out.log", // 일반 로그 파일 경로
            log_date_format: "YYYY-MM-DD HH:mm:ss", // 로그에 표시될 날짜 형식
        },
    ],
}
