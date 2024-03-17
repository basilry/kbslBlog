import styles from "@styles/pages/projectsPics.module.scss"

const SolutionInitPics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <img src="/kbslBlog/solutionPics/sirMast.png" alt="myFace" />
                <img src="/kbslBlog/solutionPics/empMast1.png" alt="myFace" />
                <img src="/kbslBlog/solutionPics/sirMast2.png" alt="myFace" />
                <img src="/kbslBlog/solutionPics/empMast2.png" alt="myFace" />
                <img src="/kbslBlog/solutionPics/careProv.png" alt="myFace" />
                <img src="/kbslBlog/solutionPics/empMast4.png" alt="myFace" />
            </div>
        </div>
    )
}

export default SolutionInitPics
