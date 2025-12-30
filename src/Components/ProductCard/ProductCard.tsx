import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import type { Product } from '../../shared/types/product/ProductTypes';
import { Button } from '../Button/Button';
import { ShoppingBag, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  vendorShopId: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  vendorShopId,
}) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/product/${product.productId}`, {
      state: { vendorShopId }
    });
  };

  const isOutOfStock = product.isStockTracked && product.quantity === 0;
  const isAvailable = product.isAvailable && !isOutOfStock;

  return (
    <div className={styles.productCard}>
      <div className={styles.imageSection}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <ShoppingBag size={48} />
          </div>
        )}

        {/* Availability Badge */}
        <div className={`${styles.badge} ${isAvailable ? styles.availableBadge : styles.unavailableBadge}`}>
          {isAvailable ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.priceContainer}>
            <span className={styles.priceValue}>{product.price.toFixed(2)}</span>
            <span className={styles.priceSymbol}> EGP</span>
          </div>
        </div>

        <p className={styles.description}>
          {product.description || 'No description available for this item.'}
        </p>

        <div className={styles.footer}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleViewProduct}
            leftIcon={<Info size={18} />}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};
