import { useState, useEffect } from "react";
import { getCustomerOrders } from "../../../services/ordersService";
import type { Order } from "./OrderType";
import { OrderDetails } from "../../../Components/OrderDetails/OrderDetails";
import { OrderStatusDisplay } from "../../../Components/OrderStatusDisplay/OrderStatusDisplay";
import styles from "./Orders.module.css";

export const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderStatuses = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PREPARING', label: 'Preparing' },
        { value: 'READY_FOR_PICKUP', label: 'Ready' },
        { value: 'OUT_FOR_DELIVERY', label: 'On the Way' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];

    // const [selectedStatus, setSelectedStatus] = useState(orderStatuses[0].value);
    // const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const res = await getCustomerOrders();
                if (res.status === 200) {
                    console.log(res.data);
                    setOrders(Array.isArray(res.data) ? res.data : []);
                    // setFilteredOrders(Array.isArray(res.data) ? res.data.filter((order) => order.status === selectedStatus.value) : []);
                } else {
                    setError(res.message || 'Failed to load orders');
                }
            } catch (err) {
                setError('An error occurred while fetching orders');
                console.error('Error fetching orders:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // useEffect(() => {
    //     const filtered = selectedStatus === 'all' 
    //         ? orders 
    //         : orders.filter((order) => order.status === selectedStatus);
    //     setFilteredOrders(filtered);
    // }, [selectedStatus, orders]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorText}>{error}</p>
                <button 
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.pageTitle}>My Orders</h1>
            
            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) :  (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <OrderDetails key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};