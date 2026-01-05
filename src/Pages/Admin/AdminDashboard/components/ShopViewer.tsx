import { useState, useEffect } from 'react';
import { adminService, type AdminShop } from '../../../../services/adminService';
import styles from '../AdminDashboard.module.css';
import { Store, MapPin, Coffee, CheckCircle2 } from 'lucide-react';

export const ShopViewer = () => {
    const [shops, setShops] = useState<AdminShop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadShops = async () => {
            try {
                const data = await adminService.getAllShops();
                setShops(data);
            } catch (error) {
                console.error('Error loading shops:', error);
            } finally {
                setLoading(false);
            }
        };
        loadShops();
    }, []);

    return (
        <div className={styles.managementSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerInfo}>
                    <Store className={styles.headerIcon} />
                    <div>
                        <h2>Shop Explorer</h2>
                        <p>View all coffee shops across the platform</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading shops...</p>
            ) : (
                <div className={styles.shopGrid}>
                    {shops.map(shop => (
                        <div key={shop.id} className={styles.shopItemCard}>
                            <div className={styles.shopCardHeader}>
                                <Coffee className={styles.shopIcon} />
                                <div className={shop.isActive ? styles.statusBadge : styles.statusBadgeInactive}>
                                    <CheckCircle2 size={12} /> {shop.isActive ? 'Active' : 'Inactive'}
                                </div>
                                {shop.isOnline && (
                                    <div className={styles.onlineBadge}>
                                        Online
                                    </div>
                                )}
                            </div>
                            <h3>{shop.name}</h3>
                            <p className={styles.vendorTag}>Owner: {shop.vendorName}</p>

                            <div className={styles.locationDetails}>
                                <span><MapPin size={14} /> {shop.city}</span>
                                <span className={styles.addressText}>{shop.address}</span>
                            </div>

                            <div className={styles.shopContact}>
                                <span>{shop.phoneNumber}</span>
                                <span>{shop.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
