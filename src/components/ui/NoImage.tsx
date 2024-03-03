import TextBasic from "@components/atom/TextBasic"
import styles from "@styles/ui/noImage.module.scss"

const NoImage = (): JSX.Element => {
    return (
        <div className={styles.noImage}>
            <img src="/kbslBlog/noimage.png" alt="myFace" sizes={"100vw"} width={300} height={300} />
            <TextBasic size="large" bold="bold">
                데이터가 없습니다.
            </TextBasic>
        </div>
    )
}

export default NoImage
