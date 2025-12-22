import { ViewToggler } from "../../Components/ViewToggler/ViewToggler";
import { useState } from "react";
import { ProductsCatalog } from "./ProductsCatalog/ProductsCatalog";
import { OrderHistory } from "./OrderHistory/OrderHistory";

export const VendorAccessPage = () => {
    const [selected, setSelected] = useState("Products");
    
    return (
        <div style={{width: "100%"}}>
            <h1>Vendor Access</h1>
            <ViewToggler onChange={(value) => setSelected(value)} options={["Products", "Orders"]} />
            {selected === "Products" && <ProductsCatalog />}
            {selected === "Orders" && <OrderHistory />}
        </div>
    );
};