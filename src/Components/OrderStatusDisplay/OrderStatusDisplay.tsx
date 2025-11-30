
import { OrderStatusDiv } from "./OrderStatusDiv";
import styles from "./OrderStatusStyles.module.css";
import { useState } from "react";

interface OrderStatusDisplayProps {
    statuses: { value: string; label: string }[];
    onStatusChange: (status: string) => void;
}

export const OrderStatusDisplay = ({ statuses, onStatusChange }: OrderStatusDisplayProps) => {
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    
    return (
        <div className={styles.statusDisplay}>
            {statuses.map((status, index) => (
                <OrderStatusDiv
                    key={status.value}
                    status={status}
                    isSelected={selectedStatus === index}
                    onClick={() => {
                        setSelectedStatus(index);
                        onStatusChange(status.value);
                    }}
                />
            ))}
        </div>
    );
};
