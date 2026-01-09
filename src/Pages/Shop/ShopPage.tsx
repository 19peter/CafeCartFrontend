import { useEffect, useState } from "react";
import ToggleButton from "../../Components/Toggle/ToggleButton";
import styles from "./ShopPage.module.css";
import { ViewToggler } from "../../Components/ViewToggler/ViewToggler";
import { OrdersPage } from "./Orders/OrdersPage";
import { InventoryPage } from "./Inventory/InventoryPage";
import { useAuth } from "../../contexts/AuthContext";
import { setIsOnline, setIsDeliveryAvailable, getShopSettings } from "../../services/vendorShopsService";
import { Client } from '@stomp/stompjs';
import type { Area } from "../../shared/types/Shop/Shop";
import { addDeliveryArea, deleteDeliveryArea, updateDeliveryArea } from "../../services/deliverySettingsService";

type ShopSettings = {
    shopId: string;
    shopName: string;
    online: boolean;
    deliveryAllowed: boolean;
    deliveryAreas: Area[];
}

export const ShopPage = () => {
    const [areasModalOpen, setAreasModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);

    const [selected, setSelected] = useState("Orders");
    const [settings, setSettings] = useState<ShopSettings>({} as ShopSettings);
    const [_, setStompClient] = useState<Client | null>(null);
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

    const handleSaveArea = async () => {
        if (!editingArea) return;

        if (editingArea.id) {
            const res = await updateDeliveryArea(editingArea);
            if (res.status === 200) {
                setSettings((prev) => ({
                    ...prev,
                    deliveryAreas: prev.deliveryAreas.map((a) => (a.id === editingArea.id ? editingArea : a))
                }));
            }
        } else {
            const res = await addDeliveryArea(editingArea);
            if (res.status === 200) {
                setSettings((prev) => ({
                    ...prev,
                    deliveryAreas: [...prev.deliveryAreas, { ...editingArea, id: Date.now() }]
                }));
            }
        }

        setEditingArea(null);
    };


    const handleDeleteArea = async (area: Area) => {
        if (!area.id) return;
        const res = await deleteDeliveryArea(area);
        if (res.status === 200) {
            setSettings((prev) => ({
                ...prev,
                deliveryAreas: prev.deliveryAreas.filter((a) => a.id !== area.id)
            }));
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await getShopSettings();
            if (res.status === 200) {
                let deliveryAllowed = res.data.deliverySettingsDto.deliveryAvailable;
                let online = res.data.online;
                let shopId = res.data.shopId;
                let shopName = res.data.shopName;
                let deliveryAreas = res.data.deliverySettingsDto.deliveryAreasDtoList;
                setSettings({ shopId, shopName, online, deliveryAllowed, deliveryAreas });
                setShopId(shopId);
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
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            setConnected(true);

            client.subscribe(`/topic/shop/${shopId}/orders`, (_) => {
                setNewOrder(true);
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            setConnected(false);
        };

        client.onWebSocketClose = () => {
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
                <div className={styles.navbarInner}>

                    {/* LEFT */}
                    <div className={styles.navbarLeft}>
                        <h1 className={styles.shopName}>{settings.shopName}</h1>
                    </div>

                    {/* RIGHT */}
                    <div className={styles.navbarRight}>

                        <div className={styles.controlRow}>
                            <span className={styles.controlLabel}>
                                {settings.online ? "Online" : "Offline"}
                            </span>
                            <ToggleButton onToggle={handleModeChange} value={settings.online} />
                        </div>

                        <div className={styles.controlRow}>
                            <span className={styles.controlLabel}>Delivery</span>
                            <ToggleButton onToggle={handleDeliveryChange} value={settings.deliveryAllowed} />

                            {settings.deliveryAllowed && (
                                <button
                                    className={styles.manageBtn}
                                    onClick={() => setAreasModalOpen(true)}
                                >
                                    Delivery Settings
                                </button>
                            )}
                        </div>

                        <div className={styles.divider} />

                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Log out
                        </button>

                        <span
                            className={`${styles.status} ${connected ? styles.connected : styles.disconnected
                                }`}
                        >
                            {connected ? "Live" : "Disconnected"}
                        </span>

                    </div>

                </div>
            </nav>

            {areasModalOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setAreasModalOpen(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className={styles.modalHeader}>
                            <h2>Delivery Areas</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setAreasModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* LIST */}
                        <div className={styles.areaList}>
                            {settings.deliveryAreas.length === 0 && (
                                <p className={styles.empty}>No delivery areas</p>
                            )}

                            {settings.deliveryAreas.map((area) => (
                                <div key={area.id} className={styles.areaRow}>
                                    <div>
                                        <strong>{area.area}</strong>
                                        <div className={styles.sub}>
                                            {area.city} • {area.price} EGP
                                        </div>
                                    </div>

                                    <button
                                        className={styles.editBtn}
                                        onClick={() => setEditingArea(area)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteArea(area)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* FORM */}
                        <div className={styles.form}>
                            <h3>{editingArea?.id ? "Edit area" : "Add new area"}</h3>

                            <input
                                placeholder="Area name"
                                value={editingArea?.area ?? ""}
                                onChange={(e) =>
                                    setEditingArea((prev) => ({
                                        ...(prev ?? { city: "", price: 0 }),
                                        area: e.target.value
                                    }))
                                }
                            />

                            <input
                                placeholder="City"
                                value={editingArea?.city ?? ""}
                                onChange={(e) =>
                                    setEditingArea((prev) => ({
                                        ...(prev ?? { area: "", price: 0 }),
                                        city: e.target.value
                                    }))
                                }
                            />

                            <input
                                type="number"
                                placeholder="Delivery price"
                                value={editingArea?.price ?? ""}
                                onChange={(e) =>
                                    setEditingArea((prev) => ({
                                        ...(prev ?? { area: "", city: "" }),
                                        price: Number(e.target.value)
                                    }))
                                }
                            />

                            <button
                                className={styles.saveBtn}
                                onClick={handleSaveArea}
                                disabled={!editingArea}
                            >
                                {editingArea?.id ? "Save changes" : "Add area"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


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

