import classNames from "classnames"
import styles from "@styles/pages/projectsPics.module.scss"

const ImsPart1Pics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock, styles.mobilePics)}>
                <img src="/kbslBlog/imsPics/ims1.png" alt="myFace" />

                <img src="/kbslBlog/imsPics/ims2.png" alt="myFace" />

                <img src="/kbslBlog/imsPics/ims3.png" alt="myFace" />

                <img src="/kbslBlog/imsPics/ims4.png" alt="myFace" />

                <img src="/kbslBlog/imsPics/ims5.png" alt="myFace" />

                <img src="/kbslBlog/imsPics/ims6.png" alt="myFace" />
            </div>
        </div>
    )
}

export default ImsPart1Pics
