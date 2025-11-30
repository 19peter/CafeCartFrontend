import styles from "./OrderStatusStyles.module.css";

interface OrderStatusDivProps {
    status: { value: string; label: string };
    isSelected: boolean;
    onClick: () => void;
}

export const OrderStatusDiv = ({ status, isSelected, onClick }: OrderStatusDivProps) => {
    return (
        <div
            className={`${styles.statusDiv} ${isSelected ? styles.selectedStatusDiv : ''}`}
            onClick={onClick}
        >
            <span>{status.label}</span>
        </div>
    );
};
