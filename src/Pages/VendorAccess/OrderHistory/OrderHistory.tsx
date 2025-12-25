import { useEffect, useState } from "react";
import { getVendorOrders } from "../../../services/ordersService";
import type { ShopOrder } from "../../../shared/types/orders/ShopOrder";
import { getVendorShopsByVendorId } from "../../../services/vendorShopsService";
import type { Shop } from "../../../shared/types/Shop/Shop";
import styles from "./OrderHistory.module.css";
import type { SalesSummary } from "../../../shared/types/orders/SalesSummary";
import { getSaleSummaryByMonth } from "../../../services/ordersService";

export const OrderHistory = () => {

    const [orders, setOrders] = useState<ShopOrder[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [shops, setShops] = useState<Shop[]>([]);
    const [shopId, setShopId] = useState<number>(0);
    const [monthSaleSummary, setMonthSaleSummary] = useState<SalesSummary>({
        totalSales: 0,
        totalOrders: 0
    });

    const fetchMonthSaleSummary = async () => {
        try {
            const res = await getSaleSummaryByMonth(year, month, shopId);
            let salesSummary: SalesSummary = {
                totalSales: 0,
                totalOrders: 0
            };
            if (res.data) {
                salesSummary.totalOrders = res.data.ordersNumber;
                salesSummary.totalSales = res.data.totalPrice;
            }
            setMonthSaleSummary(salesSummary);
        } catch (error) {
            console.error("Error fetching month sale summary:", error);
        }
    };
    const fetchOrders = async () => {
        try {
            const res = await getVendorOrders(year, month, page, size, shopId);
            setOrders(res.data.content);
            setTotalPages(res.data.page.totalPages);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchVendorShops = async () => {
        try {
            const res = await getVendorShopsByVendorId("trove");
            setShops(res);
            setShopId(res[0].id);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    useEffect(() => {
        fetchVendorShops();
    }, []);

    useEffect(() => {
        if (shopId === 0) return;
        fetchOrders();
        fetchMonthSaleSummary();
    }, [page, size, year, month, shopId]);

    const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 0));
    const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>
                Orders — {month}/{year}
            </h1>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span>Total Sales</span>
                    <strong>${monthSaleSummary.totalSales}</strong>
                </div>
                <div className={styles.summaryCard}>
                    <span>Total Orders</span>
                    <strong>{monthSaleSummary.totalOrders}</strong>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersCard}>
                <div className={styles.filterGroup}>
                    <label>Month</label>
                    <input type="number" min="1" max="12" value={month} onChange={e => setMonth(+e.target.value)} />
                </div>

                <div className={styles.filterGroup}>
                    <label>Year</label>
                    <input type="number" value={year} onChange={e => setYear(+e.target.value)} />
                </div>

                <div className={styles.filterGroup}>
                    <label>Shop</label>
                    <select value={shopId} onChange={e => setShopId(+e.target.value)}>
                        {shops?.map(shop => (
                            <option key={shop.id} value={shop.id}>{shop.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Order</th>
                            <th>Type</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td className={styles.orderNumber}>{order.orderNumber}</td>
                                <td>{order.orderType}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>${order.totalPrice}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <ul className={styles.itemsList}>
                                        {order.items.map(item => (
                                            <li key={item.id}>
                                                {item.name} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <button disabled={page === 0} onClick={handlePrevPage}>Prev</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={handleNextPage}>Next</button>
            </div>
        </div>

    );
};