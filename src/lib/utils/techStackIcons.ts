const ICON_MAP: Record<string, { src: string; width: number; height: number }> = {
    typescript: { src: "/skills/typescript.svg", width: 60, height: 60 },
    nextjs: { src: "/skills/nextjs.svg", width: 60, height: 60 },
    sass: { src: "/skills/sass.svg", width: 60, height: 60 },
    redux: { src: "/skills/redux.svg", width: 60, height: 60 },
    zustand: { src: "/skills/zustand.png", width: 60, height: 60 },
    prettier: { src: "/skills/prettier.svg", width: 60, height: 60 },
    eslint: { src: "/skills/eslint.svg", width: 60, height: 60 },
    mysql: { src: "/skills/mysql.png", width: 60, height: 60 },
    mssql: { src: "/skills/mssql.png", width: 60, height: 60 },
    aws: { src: "/skills/aws.svg", width: 60, height: 60 },
    kendoui: { src: "/skills/kendoui.png", width: 180, height: 60 },
    oz: { src: "/skills/oz.png", width: 60, height: 60 },
    emotion: { src: "/skills/emotion.png", width: 60, height: 60 },
    reactquery: { src: "/skills/reactquery.svg", width: 60, height: 60 },
    mui: { src: "/skills/mui.svg", width: 60, height: 60 },
    java: { src: "/skills/java.png", width: 60, height: 60 },
    springboot: { src: "/skills/springboot.png", width: 60, height: 60 },
    jpa: { src: "/skills/jpa.png", width: 60, height: 60 },
    hibernate: { src: "/skills/hibernate.png", width: 60, height: 60 },
    querydsl: { src: "/skills/querydsl.png", width: 60, height: 60 },
    nodejs: { src: "/skills/nodejs.png", width: 60, height: 60 },
    expressjs: { src: "/skills/expressjs.png", width: 60, height: 60 },
    angularjs: { src: "/skills/angularjs.png", width: 60, height: 60 },
    reactjs: { src: "/skills/reactjs.png", width: 60, height: 60 },
    vue: { src: "/skills/vue.png", width: 60, height: 60 },
    vite: { src: "/skills/vite.png", width: 60, height: 60 },
    vercel: { src: "/skills/vercel.png", width: 60, height: 60 },
}

export const getTechStackIcon = (name: string): { src: string; width: number; height: number } => {
    return ICON_MAP[name] ?? { src: `/skills/${name}.svg`, width: 60, height: 60 }
}
