import React from 'react';
import { MapPin, Store } from 'lucide-react';
import styles from './LocationSelector.module.css';
import type { Shop } from '../../../shared/types/Shop/Shop';

interface LocationSelectorProps {
    shops: Shop[];
    selectedShopId: number;
    onShopChange: (shopId: number) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    shops,
    selectedShopId,
    onShopChange,
}) => {
    if (shops.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.sectionHeader}>
                <MapPin size={20} className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Choose a Location</h3>
            </div>
            <div className={styles.list}>
                {shops.map((shop) => (
                    <button
                        key={shop.id}
                        className={`${styles.card} ${selectedShopId === shop.id ? styles.active : ''}`}
                        onClick={() => onShopChange(shop.id)}
                        type="button"
                    >
                        <div className={styles.cardHeader}>
                            <Store size={20} className={styles.storeIcon} />
                            <div className={styles.shopInfo}>
                                <span className={styles.shopName}>{shop.name}</span>
                                {shop.address && (
                                    <span className={styles.shopAddress}>{shop.address}</span>
                                )}
                            </div>
                        </div>
                        {selectedShopId === shop.id && <div className={styles.indicator} />}
                    </button>
                ))}
            </div>
        </div>
    );
};
