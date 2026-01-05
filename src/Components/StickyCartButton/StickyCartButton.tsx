import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import styles from './StickyCartButton.module.css';

export const StickyCartButton: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useCart();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems === 0) return null;

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.button}
                onClick={() => navigate('/cart')}
            >
                <div className={styles.leftSection}>
                    <div className={styles.itemCount}>{totalItems}</div>
                    <ShoppingCart size={18} />
                    <span className={styles.viewCartText}>View Cart</span>
                </div>
            </button>
        </div>
    );
};
