import { useEffect, useState } from "react";
import { OrdersTable } from "../../../Components/VendorOrderTable/OrderTable";
import { getShopOrders } from "../../../services/ordersService";
import type { ShopOrder } from "../../../shared/types/orders/ShopOrder";
import styles from "./OrdersPage.module.css";
import type { BasicCustomerInfo } from "../../../shared/types/customer/CustomerTypes";
import { blockUser, getBlockedCustomers, unblockUser } from "../../../services/vendorShopsService";
import { useNotification } from "../../../hooks/useNotification";
import BlockedCustomersModal from "../../../Components/BlockedUserModal/BlockedUserModal";

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
    setSelectedDate((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + days);
    });
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
    localStorage.setItem(
      "pinnedOrders",
      JSON.stringify(Array.from(pinnedOrders))
    );
  }, [pinnedOrders]);

  const filtered =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o: ShopOrder) => o.status === statusFilter);

  const pinned = filtered.filter(o => pinnedOrders.has(o.orderNumber));
  const unpinned = filtered.filter(o => !pinnedOrders.has(o.orderNumber));

  const ordered = [...pinned, ...unpinned];

  return (
    <div className={styles.container}>
      {/* FILTER */}
      <div className={styles.filterContainer}>
        <div style={{ marginBottom: "20px" }}>
          <label>Status Filter: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">PENDING</option>
            <option value="PREPARING">PREPARING</option>
            <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className={styles.dateContainer}>
          <button onClick={() => shiftDay(-1)}>◀</button>

          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />

          <button onClick={() => shiftDay(1)}>▶</button>
        </div>
      </div>

      {newOrder && (
        <button
          className={styles.newOrderBtn}

          onClick={() => fetchOrders()}>Get New Orders</button>
      )}

      {ordered.length > 0 ? (
        ordered.map((order: ShopOrder) => (
          <OrdersTable
            key={order.orderNumber}
            order={order}
            isCustomerBlocked={blockedCustomers.some((customer) => customer.id === order.customerId)}
            handleBlockUser={handleBlockUser}
            handleUnblockUser={handleUnblockUser}
            openBlockedCustomersModal={() => setShowBlockedModal(true)}
            isPinned={pinnedOrders.has(order.orderNumber)}
            onTogglePin={(e) => togglePin(e, order.orderNumber)}
          />
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          No orders found
        </div>
      )}

      <BlockedCustomersModal
        open={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        blockedCustomers={blockedCustomers}
        onUnblock={handleUnblockUser}
      />
    </div>
  );
};