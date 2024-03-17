import classNames from "classnames"
import styles from "@styles/pages/projectsPics.module.scss"

const CarenotePics = (): JSX.Element => {
    return (
        <div className={styles.picsWrapper}>
            <div className={classNames(styles.picsBlock, styles.mobilePics)}>
                <img src="/kbslBlog/carenotePics/carenote1.png" alt="myFace" />
                <img src="/kbslBlog/carenotePics/carenote2.png" alt="myFace" />
                <img src="/kbslBlog/carenotePics/carenote3.png" alt="myFace" />
                <img src="/kbslBlog/carenotePics/carenote4.png" alt="myFace" />
                <img src="/kbslBlog/carenotePics/carenote5.png" alt="myFace" />
                <img src="/kbslBlog/carenotePics/carenote6.png" alt="myFace" />
            </div>
        </div>
    )
}

export default CarenotePics
