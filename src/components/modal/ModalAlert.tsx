import { ReactElement } from "react"
import ButtonBasic from "@components/atom/ButtonBasic"
import TextBasic from "@components/atom/TextBasic"
import ModalBasic, { IModalProps } from "@components/modal/ModalBasic"
import styles from "@styles/components/modal/modalAlert.module.scss"

interface IModalAlertProps extends Omit<IModalProps, "children"> {
    message: string
    confirmBtnLabel: string
    onConfirm: () => void
    cancelBtnLabel?: string
    onCancel?: () => void
}

const ModalAlert = (props: IModalAlertProps): ReactElement => {
    const { isOpen, onClose, title, message, onConfirm, confirmBtnLabel, onCancel, cancelBtnLabel } = props

    return (
        <ModalBasic isOpen={isOpen} onClose={onClose} title={title}>
            <div className={styles.msgWrapper}>
                <TextBasic size={"medium"}>{message}</TextBasic>
            </div>
            <div className={styles.buttonWrapper}>
                {onCancel && (
                    <ButtonBasic buttonStyle={styles.button} type={"reset"} onClick={onCancel} label={cancelBtnLabel} />
                )}
                <ButtonBasic buttonStyle={styles.button} onClick={onConfirm} label={confirmBtnLabel} />
            </div>
        </ModalBasic>
    )
}

export default ModalAlert
