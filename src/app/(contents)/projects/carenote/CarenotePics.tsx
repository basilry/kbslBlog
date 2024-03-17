import styles from "@styles/pages/projectsPics.module.scss"

const CarenotePics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={styles.picsBlock}>
                <div>
                    <img src="/kbslBlog/carenotePics/carenote1.png" alt="myFace" sizes={"100vw"} />
                    <img src="/kbslBlog/carenotePics/carenote2.png" alt="myFace" sizes={"100vw"} />
                </div>
                <div>
                    <img src="/kbslBlog/carenotePics/carenote3.png" alt="myFace" sizes={"100vw"} />
                    <img src="/kbslBlog/carenotePics/carenote4.png" alt="myFace" sizes={"100vw"} />
                </div>
                <div>
                    <img src="/kbslBlog/carenotePics/carenote5.png" alt="myFace" sizes={"100vw"} />
                    <img src="/kbslBlog/carenotePics/carenote6.png" alt="myFace" sizes={"100vw"} />
                </div>
            </div>
        </div>
    )
}

export default CarenotePics
