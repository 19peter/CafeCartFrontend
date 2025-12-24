import { useEffect, useState } from "react";
import { getVendorOrders } from "../../../services/ordersService";
import type { ShopOrder } from "../../../shared/types/orders/ShopOrder";
import { getVendorShopsByVendorId } from "../../../services/vendorShopsService";
import type { Shop } from "../../../shared/types/Shop/Shop";

export const OrderHistory = () => {
    const [orders, setOrders] = useState<ShopOrder[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [shops, setShops] = useState<Shop[]>([]);
    const [shopId, setShopId] = useState<number>(0);

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
        fetchOrders();
    }, [page, size, year, month, shopId]);

    const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 0));
    const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));

    return (
        <div style={{ padding: "20px" }}>
            <h1>Orders for {month}/{year}</h1>

            {/* Month & Year selectors */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="number"
                    value={month}
                    min="1"
                    max="12"
                    onChange={e => setMonth(Number(e.target.value))}
                />
                <input
                    type="number"
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                />
                <button onClick={() => setPage(0)}>Load</button>
            </div>

            {/* Shop Selector */}
            <select value={shopId} onChange={e => setShopId(Number(e.target.value))}>
                {shops?.map(shop => (
                    <option key={shop.id} value={shop.id}>
                        {shop.name}
                    </option>
                ))}
            </select>

            {/* Orders Table */}
            <table cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order Number</th>
                        <th>Type</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Created At</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.status}</td>
                            <td>{order.totalPrice}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.id}>
                                            {item.name} x {item.quantity} (${item.price})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={handlePrevPage} disabled={page === 0}>Prev</button>
                <span style={{ margin: "0 10px" }}>Page {page + 1} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page + 1 >= totalPages}>Next</button>
            </div>
        </div>
    );
};