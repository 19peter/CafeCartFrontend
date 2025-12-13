import { useEffect, useState } from "react";
import ToggleButton from "../../../Components/Toggle/ToggleButton";
import styles from "./ShopPage.module.css";
import { ViewToggler } from "../../../Components/ViewToggler/ViewToggler";
import { OrdersPage } from "../Orders/OrdersPage";
import { InventoryPage } from "../Inventory/InventoryPage";
import { useAuth } from "../../../contexts/AuthContext";
import { setIsOnline, setIsDeliveryAvailable, getShopSettings } from "../../../services/vendorShopsService";



export const ShopPage = () => {
    const [selected, setSelected] = useState("orders");
    const [open, setOpen] = useState(false);
    const [delivery, setDelivery] = useState(false);
    const { logout } = useAuth();
    
    const handleModeChange = async (value: boolean) => {
        setOpen(value);
        await setIsOnline(value);
    };

    const handleDeliveryChange = async (value: boolean) => {
        setDelivery(value);
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
                setOpen(res.data.online);
                setDelivery(res.data.deliveryAllowed);
            }
        };
        fetchSettings();
    }, []);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarLeft}>
                    <h1>Trove</h1>

                </div>

                <div className={styles.navbarRight}>


                    <div className={styles.toggleContainer}>
                        <h4>{open ? "Online" : "Offline"}</h4>
                        <ToggleButton onToggle={handleModeChange} value={open} />
                    </div>

                    <div className={styles.toggleContainer}>
                        <h4>Delivery</h4>
                        <ToggleButton onToggle={handleDeliveryChange} value={delivery} />
                    </div>

                    <div className={styles.btnContainer}>
                        <button onClick={handleLogout}>Log out</button>
                    </div>

                </div>

            </nav>

            <ViewToggler onChange={(value) => setSelected(value)} />

            {selected === "orders" && <OrdersPage />}
            {selected === "inventory" && <InventoryPage />}


        </>
    );
};

