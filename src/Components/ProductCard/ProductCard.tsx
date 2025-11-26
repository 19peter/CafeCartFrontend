import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  vendorShopId: number;
  productId: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  description,
  productId,
  vendorShopId
}) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    // Navigate to product detail page with product data
    navigate(`/product/${productId}`, {
      state: {
        vendorShopId
      }
    });
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img 
          src={'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
          alt={name}
          className={styles.productImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`;
          }}
        />
        <div className={styles.productOverlay}></div>
      </div>
      <div className={styles.productInfo}>
        <h3>{name}</h3>
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productPrice}>${price.toFixed(2)}</p>
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
