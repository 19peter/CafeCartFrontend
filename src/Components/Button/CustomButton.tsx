import styles from './Button.module.css';



interface ButtonProps {
    text: string;       // required string
    backgroundColor: string;
    fontColor: string;
}

export const CustomButton = ({ text = "Click", backgroundColor, fontColor }: ButtonProps) => {
    return (

        <button className={styles.custom_btn}
            style={{
                backgroundColor: backgroundColor,
                color: fontColor,
                 
            }}>
            {text}

        </button>
    )
}