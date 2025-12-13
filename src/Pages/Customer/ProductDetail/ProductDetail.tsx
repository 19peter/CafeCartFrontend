import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../contexts/AuthContext';
import { addToCart } from '../../../services/cartService';
import type { Product } from '../../../shared/types/product/ProductTypes';
import { getVendorProduct } from '../../../services/shopProductService';

interface LocationState {
  state: { vendorShopId: number };
}

export const ProductDetail = () => {
  const location = useLocation() as unknown as LocationState;
  const { vendorShopId } = location.state;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { isAuthenticated } = useAuth();
  const { productId } = useParams<{ productId: string }>();

  // Fetch latest stock when component mounts
  useEffect(() => {
    const fetchLatestStock = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      };

      const data = await getVendorProduct({ vendorShopId: Number(vendorShopId), productId: Number(productId) });
      console.log(data);
      setProductDetails(data);
      setIsLoading(false);

    }

    fetchLatestStock();
  }, [productId, vendorShopId]);

  const handleAddToCart = async () => {
    isAuthenticated ? null : navigate('/login');
    if (!productDetails || productDetails.quantity === 0) return;
    let res: { status: number, message: string } = await addToCart({ productId: Number(productId), shopId: Number(vendorShopId), quantity });
    if (res.status !== 200) {
      showError(res.message);
    } else {
      showSuccess(`${quantity} ${productDetails.name} added to cart!`);
      setQuantity(1);
    }

  };

  const increaseQuantity = () => {
    if (quantity < productDetails!.quantity) {
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



  return (
    productDetails ? (
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          &larr; Back to Menu
        </button>


        <div className={styles.productContainer}>
          <div className={styles.imageContainer}>
            <img
              // src={ productDetails?.imageUrl} 
              src={'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}

              alt={productDetails?.name}
              className={styles.productImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.jpg';
              }}
            />
          </div>

          <div className={styles.detailsContainer}>
            <h1 className={styles.productName}>{productDetails?.name}</h1>
            <p className={styles.description}>{productDetails?.description}</p>
            <p className={styles.price}>${productDetails?.price.toFixed(2)}</p>

            <div className={styles.stockStatus}>
              {productDetails.isStockTracked ? (
                productDetails.isAvailable ? (
                  <span className={styles.inStock}>In Stock - {productDetails.quantity}</span>
                ) : (
                  <span className={styles.outOfStock}>Out of Stock</span>
                )
              ) : (
                <span className={styles.inStock}>In Stock</span>

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
                disabled={quantity >= productDetails!.quantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
              disabled={!productDetails.isAvailable}
            >
              {productDetails!.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    ) : null

  );
};
