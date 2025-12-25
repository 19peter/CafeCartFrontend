import { ViewToggler } from "../../Components/ViewToggler/ViewToggler";
import { useState } from "react";
import { ProductsCatalog } from "./ProductsCatalog/ProductsCatalog";
import { OrderHistory } from "./OrderHistory/OrderHistory";
import { getVendorInfo } from "../../services/vendorsService";
import { useEffect } from "react";
import type { VendorDetails } from "../../shared/types/Vendor/VendorDetails";
import styles from "./VendorAccessPage.module.css";

export const VendorAccessPage = () => {
    const [selected, setSelected] = useState("Products");
    const [vendorDetails, setVendorDetails] = useState<VendorDetails>({
        id: 0,
        name: "",
        email: "",
        phoneNumber: ""
    });

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const res = await getVendorInfo();
                setVendorDetails(res.data);
            } catch (error) {
                console.error("Error fetching vendor details:", error);
            }
        };
        fetchVendorDetails();
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <div className={styles.dashboardHeader}>
                <div>
                    <h1 className={styles.dashboardTitle}>
                        {vendorDetails.name}
                    </h1>
                    <p className={styles.dashboardSubtitle}>
                        Vendor Dashboard
                    </p>
                </div>
            </div>
            <ViewToggler onChange={(value) => setSelected(value)} options={["Products", "Orders"]} />
            {selected === "Products" && <ProductsCatalog />}
            {selected === "Orders" && <OrderHistory />}
        </div>
    );
};