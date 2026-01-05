import { useState } from "react";
import styles from "./OrderTable.module.css";
import type { OrderItem, ShopOrder } from "../../shared/types/orders/ShopOrder";
import { updateOrderStatus, cancelOrder, updatePaymentStatus } from "../../services/ordersService";
import { useNotification } from "../../contexts/NotificationContext";
import { verifyCustomer } from "../../services/customerService";
import {
    Clock,
    User,
    Phone,
    MapPin,
    CreditCard,
    ShoppingBag,
    CheckCircle,
    XCircle,
    ChevronDown,
    Pin,
    Shield,
    ShieldAlert,
    Ban,
    ExternalLink
} from "lucide-react";

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
    isPinned: boolean;
    onTogglePin: (e: React.MouseEvent<HTMLButtonElement>, orderNumber: string) => void;
}

export const OrdersTable = ({ order, isCustomerBlocked, handleBlockUser, handleUnblockUser, openBlockedCustomersModal, isPinned, onTogglePin }: Props) => {
    const { showError, showSuccess } = useNotification();
    const [isExpanded, setIsExpanded] = useState(false);
    const [tableOrder, setTableOrder] = useState<ShopOrder>(order);

    function formatDate(dateString: string) {
        const parts = dateString.split('T');
        if (parts.length < 2) return dateString;
        const date = parts[0];
        const time = parts[1].split('.')[0].substring(0, 5); // Just HH:mm
        return `${date} ${time}`;
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

    const handleVerifyCustomer = async (customerId: number) => {
        const res = await verifyCustomer(customerId);
        if (res.status === 200 && res.data) {
            setTableOrder({ ...tableOrder, verified: true });
            showSuccess("Customer verified successfully");
        } else {
            showError("Failed to verify customer");
        }
    };

    const handleConfirmPayment = async (orderId: number) => {
        const res = await updatePaymentStatus({ orderId, paymentStatus: "PAID" });
        if (res.status === 200) {
            setTableOrder({ ...tableOrder, paymentStatus: "PAID" });
            showSuccess("Payment confirmed successfully");
        } else {
            showError("Failed to confirm payment");
        }
    };

    return (
        <div className={`${styles.orderCard} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.cardHeader} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={styles.mainInfo}>
                    <div className={styles.pinSection}>
                        <button
                            className={`${styles.pinBtn} ${isPinned ? styles.pinned : styles.unpinned}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTogglePin(e, tableOrder.orderNumber);
                            }}
                        >
                            <Pin size={18} fill={isPinned ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <div className={styles.orderIdent}>
                        <div className={styles.orderNumber}>
                            <span>#</span>{tableOrder.orderNumber}
                        </div>
                        <div className={styles.customerName}>{tableOrder.customerName}</div>
                    </div>
                </div>

                <div className={styles.metaInfo}>
                    <div className={styles.timeInfo}>
                        <Clock size={16} />
                        {formatDate(tableOrder.createdAt)}
                    </div>
                    <div className={styles.itemCount}>{tableOrder.items.length} Items</div>
                    <div className={`${styles.statusBadge} ${styles[tableOrder.status]}`}>
                        {tableOrder.status === 'DELIVERED' && <CheckCircle size={14} />}
                        {tableOrder.status === 'CANCELLED' && <XCircle size={14} />}
                        {tableOrder.status.replace(/_/g, " ")}
                    </div>
                    <ChevronDown size={20} className={styles.expandIcon} />
                </div>
            </div>

            {isExpanded && (
                <div className={styles.cardDetails}>
                    <div className={styles.detailGrid}>
                        <div className={styles.itemsSection}>
                            <h4>Order Summary</h4>
                            <ul className={styles.itemsList}>
                                {tableOrder.items.map((item: OrderItem, i: number) => (
                                    <li key={i} className={styles.orderItem}>
                                        <div className={styles.itemName}>
                                            {item.quantity}x {item.name}
                                        </div>
                                        <div className={styles.itemPrice}>
                                            {(item.price * item.quantity).toFixed(2)} EGP
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.totalPrice}>
                                <div className={styles.totalLabel}>Grand Total</div>
                                <div className={styles.totalAmount}>{tableOrder.totalPrice.toFixed(2)} EGP</div>
                            </div>
                        </div>

                        <div className={styles.customerSection}>
                            <h4>Customer Details</h4>
                            <div className={styles.customerInfo}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Verification</div>
                                    <div className={styles.infoValue}>
                                        {tableOrder.verified ? (
                                            <span className={styles.verifiedBadge}>
                                                <Shield size={16} /> Verified Customer
                                            </span>
                                        ) : (
                                            <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <ShieldAlert size={16} /> Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Contact Info</div>
                                    <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Phone size={14} /> {tableOrder.phone}
                                    </div>
                                </div>

                                {tableOrder.orderType === "DELIVERY" && (
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Delivery Address</div>
                                        <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <MapPin size={14} style={{ marginTop: '3px', flexShrink: 0 }} />
                                            {tableOrder.address}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Payment & Type</div>
                                    <div className={styles.infoValue} style={{ display: 'flex', gap: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CreditCard size={14} /> {tableOrder.paymentMethod}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: tableOrder.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                                            {tableOrder.paymentStatus}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <ShoppingBag size={14} /> {tableOrder.orderType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.actionButtons}>
                                {!tableOrder.verified && (
                                    <button onClick={() => handleVerifyCustomer(tableOrder.id)} className={styles.actionBtn}>
                                        <Shield size={14} /> Verify
                                    </button>
                                )}

                                {tableOrder.paymentStatus !== "PAID" && (
                                    <button onClick={() => handleConfirmPayment(tableOrder.id)} className={styles.actionBtn} style={{ color: '#10b981' }}>
                                        <CreditCard size={14} /> Confirm Payment
                                    </button>
                                )}

                                {isCustomerBlocked ? (
                                    <button onClick={() => handleUnblockUser(tableOrder.customerId)} className={styles.actionBtn}>
                                        <User size={14} /> Unblock
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBlockUser(tableOrder.customerId, tableOrder.customerName, tableOrder.phone)}
                                        className={styles.actionBtn}
                                        style={{ color: '#ef4444' }}
                                    >
                                        <Ban size={14} /> Block
                                    </button>
                                )}

                                <button
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openBlockedCustomersModal();
                                    }}
                                >
                                    <ExternalLink size={14} /> View All Blocked
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statusUpdateSection}>
                        <div className={styles.statusTitle}>Update Order Progress</div>
                        <div className={styles.statusTimeline}>
                            {ORDER_STATUSES.map((s) => (
                                <div
                                    key={s}
                                    className={`${styles.statusSelector} ${s === tableOrder.status ? styles.active : ''}`}
                                >
                                    {s.replace(/_/g, " ")}
                                </div>
                            ))}
                        </div>
                        <div className={styles.footerActions}>
                            {tableOrder.status !== 'CANCELLED' && tableOrder.status !== 'DELIVERED' && (
                                <button className={styles.confirmUpdateBtn} onClick={() => updateStatus(tableOrder.id)}>
                                    Move to Next Stage
                                </button>
                            )}
                            {tableOrder.status !== 'CANCELLED' && tableOrder.status !== 'DELIVERED' && (
                                <button className={styles.cancelBtn} onClick={() => handleCancelOrder(tableOrder.id)}>
                                    Reject Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
