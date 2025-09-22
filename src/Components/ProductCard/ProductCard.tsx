import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  description,
  rating,
}) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    // Navigate to product detail page with product data
    navigate(`/product/${id}`, {
      state: {
        id,
        name,
        price,
        description,
        imageUrl,
        rating,
      }
    });
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img 
          src={imageUrl} 
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
