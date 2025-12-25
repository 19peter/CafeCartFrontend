import { useEffect, useState } from "react";
import { OrdersTable } from "../../../Components/VendorOrderTable/OrderTable";
import { getShopOrders } from "../../../services/ordersService";
import type { ShopOrder } from "../../../shared/types/orders/ShopOrder";
import styles from "./OrdersPage.module.css";

export const OrdersPage = ({ newOrder, setNewOrder }: { newOrder: boolean, setNewOrder: (value: boolean) => void }) => {

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orders, setOrders] = useState<ShopOrder[]>([]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return new Date(`${year}-${month}-${day}`);
  });


  const shiftDay = (days: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });
  };

  const fetchOrders = async () => {
    const dateParam = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
    const res = await getShopOrders(dateParam);
    if (res.status === 200) {
      setOrders(res.data);
      setNewOrder(false);
    }
  };

  useEffect(() => {

    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const filtered =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o: ShopOrder) => o.status === statusFilter);

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

      {filtered.length > 0 ? (
        filtered.map((order: ShopOrder) => (
          <OrdersTable order={order} />
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          No orders found
        </div>
      )}
    </div>
  );
};