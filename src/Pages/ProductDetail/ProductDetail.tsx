import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  stock: number;
}

interface LocationState {
  state: Product;
}

export const ProductDetail = () => {
  const location = useLocation() as unknown as LocationState;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { showSuccess } = useNotification();
  const [productDetails, setProductDetails] = useState<Product>(location.state);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // Fetch latest stock when component mounts
  useEffect(() => {
    const fetchLatestStock = async () => {
      if (!productDetails?.id) {
        setIsLoading(false);
        return;
      };
      
      try {
        // Replace this with your actual API call to get latest stock
        // const response = await fetch(`/api/products/${productDetails.id}/stock`);
        // const { stock } = await response.json();
        
        // For now, we'll simulate an API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        const latestStock = 10; // This would come from the API response
        
        if (latestStock !== productDetails.stock) {
          setProductDetails(prev => ({
            ...prev,
            stock: latestStock
          }));
        }
      } catch (error) {
        console.error('Failed to fetch latest stock:', error);
        // Optionally show error notification
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestStock();
  }, [productDetails?.id]);

  const handleAddToCart = () => {
    isAuthenticated ? null: navigate('/login');
    addToCart(productDetails);
    // In a real app, you would add the product to the cart here
    showSuccess(`${quantity} ${productDetails?.name} added to cart!`);
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (quantity < productDetails?.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  const { 
    name, 
    price, 
    imageUrl, 
    description, 
    rating, 
    stock 
  } = productDetails;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Back to Menu
      </button>
      
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={name} 
            className={styles.productImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
        
        <div className={styles.detailsContainer}>
          <h1 className={styles.productName}>{name}</h1>
          
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? styles.filledStar : styles.emptyStar}>
                  {i < rating ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className={styles.ratingText}>{rating.toFixed(2)}</span>
          </div>
          
          <p className={styles.price}>${price.toFixed(2)}</p>
          
          <p className={styles.description}>{description}</p>
          
          <div className={styles.stockStatus}>
            {stock > 0 ? (
              <span className={styles.inStock}>In Stock ({stock} available)</span>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>
          
          <div className={styles.quantitySelector}>
            <button 
              onClick={decreaseQuantity} 
              className={styles.quantityButton}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button 
              onClick={increaseQuantity} 
              className={styles.quantityButton}
              disabled={quantity >= stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            className={styles.addToCartButton}
            disabled={stock === 0}
          >
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};
