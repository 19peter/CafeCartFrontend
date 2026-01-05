import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrdersTable } from "../../../Components/VendorOrderTable/OrderTable";
import { getShopOrders } from "../../../services/ordersService";
import type { ShopOrder } from "../../../shared/types/orders/ShopOrder";
import styles from "./OrdersPage.module.css";
import type { BasicCustomerInfo } from "../../../shared/types/customer/CustomerTypes";
import { blockUser, getBlockedCustomers, unblockUser } from "../../../services/vendorShopsService";
import { useNotification } from "../../../hooks/useNotification";
import BlockedCustomersModal from "../../../Components/BlockedUserModal/BlockedUserModal";
import { Calendar, Filter, RefreshCw, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

export const OrdersPage = ({ newOrder, setNewOrder }: { newOrder: boolean, setNewOrder: (value: boolean) => void }) => {
  const { showError, showSuccess } = useNotification();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [blockedCustomers, setBlockedCustomers] = useState<BasicCustomerInfo[]>([]);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [pinnedOrders, setPinnedOrders] = useState<Set<string>>(new Set());

  const [selectedDate, setSelectedDate] = useState(() => {
    const cairoDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
    return new Date(cairoDate);
  });

  const togglePin = (e: React.MouseEvent<HTMLButtonElement>, orderNumber: string) => {
    e.stopPropagation();
    setPinnedOrders(prev => {
      const next = new Set(prev);
      next.has(orderNumber) ? next.delete(orderNumber) : next.add(orderNumber);
      return next;
    });
  };

  const shiftDay = (days: number) => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + days));
  };

  const fetchOrders = async () => {
    const dateParam = selectedDate.toISOString().split("T")[0];
    const res = await getShopOrders(dateParam);
    if (res.status === 200) {
      setOrders(res.data);
      setNewOrder(false);
    }
  };

  const fetchBlockedCustomers = async () => {
    const res = await getBlockedCustomers();
    if (res.status === 200) {
      setBlockedCustomers(res.data);
    }
  };

  const handleBlockUser = async (userId: number, name: string, phone: string) => {
    const res = await blockUser(userId);
    if (res.status === 200) {
      showSuccess("User blocked successfully");
      setBlockedCustomers([...blockedCustomers, { id: userId, firstName: name, lastName: "", phone: phone }]);
    } else {
      showError("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId: number) => {
    const res = await unblockUser(userId);
    if (res.status === 200) {
      showSuccess("User unblocked successfully");
      setBlockedCustomers(blockedCustomers.filter((customer) => customer.id !== userId));
    } else {
      showError("Failed to unblock user");
    }
  };

  useEffect(() => {
    fetchBlockedCustomers();
    fetchOrders();
    const saved = localStorage.getItem("pinnedOrders");
    if (saved) setPinnedOrders(new Set(JSON.parse(saved)));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("pinnedOrders", JSON.stringify(Array.from(pinnedOrders)));
  }, [pinnedOrders]);

  const filtered = statusFilter === "ALL"
    ? orders
    : orders.filter((o: ShopOrder) => o.status === statusFilter);

  const pinned = filtered.filter(o => pinnedOrders.has(o.orderNumber));
  const unpinned = filtered.filter(o => !pinnedOrders.has(o.orderNumber));
  const ordered = [...pinned, ...unpinned];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <h1>Manage Orders</h1>
          <p>Track and manage your incoming cafe orders in real-time.</p>
        </div>

        <div className={styles.controlsWrapper}>
          <div className={styles.filterGroup}>
            <div className={styles.filterField}>
              <Filter size={18} className={styles.icon} />
              <label>Status</label>
              <select
                className={styles.selectStyled}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className={styles.filterField}>
              <Calendar size={18} className={styles.icon} />
              <label>Date</label>
              <div className={styles.dateNav}>
                <button className={styles.navBtn} onClick={() => shiftDay(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <input
                  className={styles.dateInput}
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <button className={styles.navBtn} onClick={() => shiftDay(1)}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {newOrder && (
          <motion.div
            className={styles.newOrderIndicator}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <button className={styles.newOrderBtn} onClick={() => fetchOrders()}>
              <RefreshCw size={20} />
              New Orders Available
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.ordersList}>
        {ordered.length > 0 ? (
          ordered.map((order: ShopOrder, index) => (
            <motion.div
              key={order.orderNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <OrdersTable
                order={order}
                isCustomerBlocked={blockedCustomers.some((customer) => customer.id === order.customerId)}
                handleBlockUser={handleBlockUser}
                handleUnblockUser={handleUnblockUser}
                openBlockedCustomersModal={() => setShowBlockedModal(true)}
                isPinned={pinnedOrders.has(order.orderNumber)}
                onTogglePin={(e) => togglePin(e, order.orderNumber)}
              />
            </motion.div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <ShoppingBag size={64} className={styles.emptyIcon} />
            <h3>No orders found</h3>
            <p>Try changing the filters or checking another date.</p>
          </div>
        )}
      </div>

      <BlockedCustomersModal
        open={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        blockedCustomers={blockedCustomers}
        onUnblock={handleUnblockUser}
      />
    </motion.div>
  );
};