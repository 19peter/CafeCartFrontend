// import { format } from 'date-fns';
// import { format } from 'date-fns';
import { useState } from 'react';
import type { Order, OrderItem } from '../../Pages/Customer/Orders/OrderType';
import styles from './OrderDetails.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OrderDetailsProps {
  order: Order & { items?: OrderItem[] }; // Update type to include items
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return styles.statusDelivered;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.orderCard} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.orderHeader} onClick={toggleExpand}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={styles.orderNumber}>Order #{order.orderNumber}</h3>
            <p className={styles.orderDate}>
              {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>
          <div className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </div>
        </div>
        <div className={styles.expandIcon}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <div className={styles.orderInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Order Type:</span>
          <span className={styles.infoValue}>
            {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1).toLowerCase()}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Payment Method:</span>
          <span className={styles.infoValue}>
            {order.paymentMethod}
          </span>
        </div>
        {order.paymentStatus && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Payment Status:</span>
            <span className={styles.infoValue}>
              <span className={`${styles.paymentStatus} ${order.paymentStatus.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </span>
          </div>
        )}
      </div>

      {isExpanded && order.items && order.items.length > 0 && (
        <div className={styles.orderItems}>
          <h4 className={styles.itemsTitle}>Order Items</h4>
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.itemImage}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                ) : (
                  <div className={styles.itemImagePlaceholder} />
                )}
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.name}</span>
                <div className={styles.itemPriceRow}>
                  <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                  <span className={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.orderTotal} onClick={toggleExpand}>
        <span>Total Amount:</span>
        <div className={styles.totalAmountContainer}>
          <span className={styles.totalAmount}>{formatCurrency(order.totalPrice)}</span>
          {/* <button className={styles.expandButton}>
            {isExpanded ? 'Show less' : 'Show details'}
          </button> */}
        </div>
      </div>
    </div>
  );
};
