import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import type { Product } from '../../shared/types/product/ProductTypes';


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
    // Navigate to product detail page with product data
    navigate(`/product/${product.productId}`, {
      state: {
        vendorShopId
      }
    });
  };


  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImg}
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}

        <div className={styles.productOverlay}></div>
      </div>
      <div className={styles.productInfo}>
        <h3>{product.name}</h3>

        <p className={styles.productDescription}>{product.description}</p>

        {!product.isStockTracked && product.isAvailable && (
          <p className={styles.productInStock}>Available</p>
        )}

        {product.isStockTracked && product.quantity > 0 && product.isAvailable && (
          <p className={styles.productInStock}>Available in stock</p>
        )}

        {product.isStockTracked && product.quantity === 0 && product.isAvailable && (
          <p className={styles.productOutOfStock}>Not available in stock</p>
        )}
        {product.isStockTracked && !product.isAvailable && (
          <p className={styles.productOutOfStock}>Not available</p>
        )}


        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <button
          className={styles.viewButton}
          onClick={handleViewProduct}
        >
          View
        </button>
      </div>
    </div>
  );
};
