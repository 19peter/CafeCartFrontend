import { useState } from "react";
import styles from "./OrderTable.module.css";
import type { OrderItem, ShopOrder } from "../../shared/types/orders/ShopOrder";
import { updateOrderStatus, cancelOrder } from "../../services/ordersService";
import { useNotification } from "../../contexts/NotificationContext";

const ORDER_STATUSES = [
    "PENDING",
    "PREPARING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

interface Props {
    order: ShopOrder;
    isCustomerBlocked: boolean;
    handleBlockUser: (userId: number, customerName: string, customerPhone: string) => void;
    handleUnblockUser: (userId: number) => void;
    openBlockedCustomersModal: () => void;
}

export const OrdersTable = ({ order, isCustomerBlocked, handleBlockUser, handleUnblockUser, openBlockedCustomersModal }: Props) => {
    const { showError, showSuccess } = useNotification();
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [tableOrder, setTableOrder] = useState<ShopOrder>(order);

    const toggleExpand = (id: number) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter((x) => x !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }



    const updateStatus = async (orderId: number) => {
        const res = await updateOrderStatus({ orderId });
        if (res.status === 200 && res.data) {
            setTableOrder({ ...tableOrder, status: res.data });
            showSuccess("Order status updated successfully");
        } else {
            showError("Failed to update order status");
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        const res = await cancelOrder({ orderId });
        if (res.status === 200 && res.data) {
            setTableOrder({ ...tableOrder, status: "CANCELLED" });
            showSuccess("Order cancelled successfully");
        } else {
            showError("Failed to cancel order");
        }
    };

    const isExpanded = expandedRows.includes(tableOrder.id);
    return (
        <table className={styles.ordersTable}>
            <tbody>
                <tr
                    key={tableOrder.id}
                    className={styles.cardRow}
                    onClick={() => toggleExpand(tableOrder.id)}
                >
                    <td>{tableOrder.orderNumber}</td>
                    <td>{tableOrder.customerName}</td>
                    <td>
                        <span className={`${styles.statusBadge} ${styles[tableOrder.status]}`}>
                            {tableOrder?.status?.replace(/_/g, " ")}
                        </span>
                    </td>
                    <td>{formatDate(tableOrder.createdAt)}</td>
                    <td>{tableOrder.items.length} items</td>
                    <td>
                        <button className={styles.expandBtn}>
                            {isExpanded ? "▲" : "▼"}
                        </button>
                    </td>

                </tr>

                {isExpanded && (
                    <tr className={styles.expandedRow}>

                        <td colSpan={6}>
                            <div className={styles.detailsBox}>

                                <div className={styles.infoContainer}>

                                    <div className={styles.orderInfo}>
                                        <p><strong>Order Type:</strong> {tableOrder.orderType}</p>
                                        <p><strong>Payment Method:</strong> {tableOrder.paymentMethod}</p>
                                        <h4>Items</h4>
                                        <ul>
                                            {tableOrder.items.map((item: OrderItem, i: number) => (
                                                <li key={i}>
                                                    {item.name} — {item.quantity} × {item.price} EGP
                                                </li>
                                            ))}
                                        </ul>
                                        <h4>Total Price: {tableOrder.totalPrice} EGP</h4>

                                    </div>
                                    <div className={styles.customerInfo}>
                                        <h4>Customer Info</h4>
                                        <p><strong>Phone:</strong> {tableOrder.phone}</p>
                                        <div>

                                            {isCustomerBlocked ? (
                                                <button
                                                    onClick={() => handleUnblockUser(tableOrder.customerId)}
                                                    className={styles.blockBtn}
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlockUser(tableOrder.customerId, tableOrder.customerName, tableOrder.phone)}
                                                    className={styles.blockBtn}
                                                >
                                                    Block
                                                </button>
                                            )}

                                            <button
                                                className={styles.blockBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openBlockedCustomersModal();
                                                }}
                                            >
                                                View Blocked Customers
                                            </button>
                                        </div>
                                        {tableOrder.orderType === "DELIVERY" && (
                                            <>
                                                <p><strong>Address:</strong> {tableOrder.address}</p>
                                                <p>
                                                    <strong>Coordinates:</strong> {tableOrder.latitude},{" "}
                                                    {tableOrder.longitude}
                                                </p>
                                            </>
                                        )}


                                    </div>
                                </div>


                                <div className={styles.statusButtons}>
                                    {ORDER_STATUSES.map((s) => {
                                        const isCurrent = s === tableOrder?.status;

                                        return (
                                            <button
                                                key={s}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className={`${styles.statusBtn} ${isCurrent
                                                    ? styles.currentStatus
                                                    : ''
                                                    }`}
                                            >
                                                {s.replace(/_/g, " ")}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className={styles.updateBtnContainer}>
                                    <button
                                        className={styles.updateBtn}
                                        onClick={() => updateStatus(tableOrder.id)}>Update</button>

                                    <button
                                        className={styles.updateBtn}
                                        onClick={() => handleCancelOrder(tableOrder.id)}>Cancel</button>
                                </div>
                            </div>

                        </td>
                    </tr>


                )}
            </tbody>
        </table>
    );
};
