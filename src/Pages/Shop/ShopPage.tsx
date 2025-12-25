import { useEffect, useState } from "react";
import ToggleButton from "../../Components/Toggle/ToggleButton";
import styles from "./ShopPage.module.css";
import { ViewToggler } from "../../Components/ViewToggler/ViewToggler";
import { OrdersPage } from "./Orders/OrdersPage";
import { InventoryPage } from "./Inventory/InventoryPage";
import { useAuth } from "../../contexts/AuthContext";
import { setIsOnline, setIsDeliveryAvailable, getShopSettings } from "../../services/vendorShopsService";
import { Client } from '@stomp/stompjs';

type ShopSettings = {
    shopId: string;
    shopName: string;
    online: boolean;
    deliveryAllowed: boolean;
}

export const ShopPage = () => {
    const [selected, setSelected] = useState("Orders");
    const [settings, setSettings] = useState<ShopSettings>({} as ShopSettings);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);
    const [shopId, setShopId] = useState("");
    const [newOrder, setNewOrder] = useState(false);
    const { logout } = useAuth();

    const handleModeChange = async (value: boolean) => {
        setSettings({ ...settings, online: value });
        await setIsOnline(value);
    };

    const handleDeliveryChange = async (value: boolean) => {
        setSettings({ ...settings, deliveryAllowed: value });
        await setIsDeliveryAvailable(value);
    };

    const handleLogout = async () => {
        await handleDeliveryChange(false);
        await handleModeChange(false);
        logout();
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await getShopSettings();
            if (res.status === 200) {
                setSettings(res.data);
                setShopId(res.data.shopId);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        // Create STOMP client with native WebSocket
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // Note: ws:// not http://
            connectHeaders: {},
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            setConnected(true);

            // Subscribe to shop-specific orders
            client.subscribe(`/topic/shop/${shopId}/orders`, (message) => {
                // const newOrder = JSON.parse(message.body);
                // console.log('New order received:', newOrder);
                setNewOrder(true);
                // // Show notification
                // if (Notification.permission === 'granted') {
                //     new Notification('New Order', {
                //         body: `Order #${newOrder.orderId} - $${newOrder.totalAmount}`
                //     });
                // }
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            setConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('WebSocket closed');
            setConnected(false);
        };

        client.activate();
        setStompClient(client);

        // Cleanup on unmount
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [shopId]);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarLeft}>
                    <h1>{settings.shopName}</h1>

                </div>

                <div className={styles.navbarRight}>
                    <div className={styles.toggleContainer}>
                        <h4>{settings.online ? "Online" : "Offline"}</h4>
                        <ToggleButton onToggle={handleModeChange} value={settings.online} />
                    </div>

                    <div className={styles.toggleContainer}>
                        <h4>Delivery</h4>
                        <ToggleButton onToggle={handleDeliveryChange} value={settings.deliveryAllowed} />
                    </div>

                    <div className={styles.btnContainer}>
                        <button onClick={handleLogout}>Log out</button>
                    </div>

                    {/* <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
                        {connected ? '🟢 Live' : '🔴 Disconnected'}
                    </span> */}
                </div>

            </nav>

            <ViewToggler onChange={(value) => setSelected(value)} options={["Orders", "Inventory"]} />
            {newOrder &&
                <div className={styles.newOrderContainer}>
                    <span className={styles.newOrderText}>You have a new order</span>
                </div>
            }
            {selected === "Orders" && <OrdersPage newOrder={newOrder} setNewOrder={setNewOrder} />}
            {selected === "Inventory" && <InventoryPage />}

        </>
    );
};

