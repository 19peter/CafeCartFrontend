import { useEffect, useState } from "react";
import styles from "./ShopManagement.module.css";
import type { Shop } from "../../../shared/types/Shop/Shop";
import { getVendorShopsDetails, addShop, updateShop, type CreateShopRequest, type UpdateShopRequest } from "../../../services/vendorsService";
import { Coffee, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";

interface ShopManagementProps {
    vendorId: number;
}

const EMPTY_CREATE_FORM: CreateShopRequest = {
    name: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    password: "",
    vendorId: 0
};

const EMPTY_UPDATE_FORM: UpdateShopRequest = {
    name: "",
    address: "",
    city: "",
    phoneNumber: "",
    isActive: false,
};

export const ShopManagement = ({ vendorId }: ShopManagementProps) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [createForm, setCreateForm] = useState<CreateShopRequest>({ ...EMPTY_CREATE_FORM, vendorId });
    const [updateForm, setUpdateForm] = useState<UpdateShopRequest>(EMPTY_UPDATE_FORM);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            try {
                const res = await getVendorShopsDetails();
                setShops(res.data);
            } catch (error) {
                console.error("Error fetching shops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, [vendorId]);

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCreateForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUpdateForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleAddShop = async () => {
        if (!createForm.name || !createForm.address) return;
        try {
            const res = await addShop(createForm);
            if (res.status === 200) {
                // Refresh list to get full Shop object with ID
                const shopsRes = await getVendorShopsDetails();
                setShops(shopsRes.data);
                setCreateForm({ ...EMPTY_CREATE_FORM, vendorId });
            }
        } catch (error) {
            console.error("Error adding shop:", error);
        }
    };

    const handleEditClick = (shop: Shop) => {
        setEditingId(shop.id);
        setUpdateForm({
            name: shop.name,
            address: shop.address,
            city: shop.city,
            phoneNumber: shop.phoneNumber,
            isActive: shop.isActive,
        });
    };

    const handleUpdateShop = async () => {
        if (!editingId) return;
        try {
            const res = await updateShop(updateForm);
            if (res.status === 200) {
                setShops(prev => prev.map(s => s.id === editingId ? { ...s, ...res.data } : s));
                setEditingId(null);
                setUpdateForm(EMPTY_UPDATE_FORM);
            }
        } catch (error) {
            console.error("Error updating shop:", error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setUpdateForm(EMPTY_UPDATE_FORM);
    };

    return (
        <div className={styles.container}>
            <div className={styles.listSection}>
                <h2 className={styles.title}>Your Shops</h2>
                {loading ? (
                    <p>Loading shops...</p>
                ) : (
                    <div className={styles.shopGrid}>
                        {shops.map(shop => (
                            <div key={shop.id} className={styles.shopCard}>
                                <div className={styles.shopHeader}>
                                    <Coffee className={styles.shopIcon} size={24} />
                                    <div>
                                        <h3>{shop.name}</h3>
                                        <p className={styles.city}>{shop.city}</p>
                                    </div>
                                    <div className={styles.statusBadge}>
                                        {shop.isActive ? <CheckCircle size={16} color="green" /> : <XCircle size={16} color="red" />}
                                        <span>{shop.isActive ? "Active" : "Inactive"}</span>
                                    </div>
                                </div>

                                <div className={styles.shopDetails}>
                                    <div className={styles.detailItem}>
                                        <MapPin size={16} />
                                        <span>{shop.address}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Phone size={16} />
                                        <span>{shop.phoneNumber}</span>
                                    </div>
                                    {shop.email && (
                                        <div className={styles.detailItem}>
                                            <Coffee size={16} />
                                            <span>{shop.email}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.editButton} onClick={() => handleEditClick(shop)}>
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.formSection}>
                <div className={styles.formCard}>
                    <h2>{editingId ? "Edit Shop" : "Add New Shop"}</h2>

                    {editingId ? (
                        <div className={styles.formGrid}>
                            <input name="name" placeholder="Shop Name" value={updateForm.name} onChange={handleUpdateChange} />
                            <input name="address" placeholder="Address" value={updateForm.address} onChange={handleUpdateChange} />
                            <input name="city" placeholder="City" value={updateForm.city} onChange={handleUpdateChange} />
                            <input name="phoneNumber" placeholder="Phone Number" value={updateForm.phoneNumber} onChange={handleUpdateChange} />
                            <label htmlFor="isActive">Active
                                <input name="isActive" type="checkbox" checked={updateForm.isActive} onChange={handleUpdateChange} />
                            </label>
                            <div className={styles.formActions}>
                                <button className={styles.submitBtn} onClick={handleUpdateShop}>Update Shop</button>
                                <button className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.formGrid}>
                            <input name="name" placeholder="Shop Name" value={createForm.name} onChange={handleCreateChange} />
                            <input name="address" placeholder="Address" value={createForm.address} onChange={handleCreateChange} />
                            <input name="city" placeholder="City" value={createForm.city} onChange={handleCreateChange} />
                            <input name="phoneNumber" placeholder="Phone Number" value={createForm.phoneNumber} onChange={handleCreateChange} />
                            <input name="email" type="email" placeholder="Shop Email" value={createForm.email} onChange={handleCreateChange} />
                            <input name="password" type="password" placeholder="Shop Password" value={createForm.password} onChange={handleCreateChange} />

                            <button className={styles.submitBtn} onClick={handleAddShop}>Add Shop</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
