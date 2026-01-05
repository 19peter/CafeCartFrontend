import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../contexts/AuthContext';
import { addToCart } from '../../../services/cartService';
import type { Product } from '../../../shared/types/product/ProductTypes';
import { getVendorProduct } from '../../../services/shopProductService';
import { StickyCartButton } from '../../../Components/StickyCartButton/StickyCartButton';

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
  const { isAuthenticated, setOpenAuthModal } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  console.log(productDetails);
  // Fetch latest stock when component mounts
  useEffect(() => {
    const fetchLatestStock = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      };
      const data = await getVendorProduct({ vendorShopId: Number(vendorShopId), productId: Number(productId) });
      setProductDetails(data);
      setIsLoading(false);

    }

    fetchLatestStock();
  }, [productId, vendorShopId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }
    if (!productDetails || (productDetails.isStockTracked && productDetails.quantity === 0)) return;
    let res: { status: number, message: string } = await addToCart({ productId: Number(productId), shopId: Number(vendorShopId), quantity });
    if (res.status !== 200) {
      showError(res.message);
    } else {
      showSuccess(`${quantity} ${productDetails.name} added to cart!`);
      setQuantity(1);
    }

  };

  const increaseQuantity = () => {
    if ((productDetails!.isStockTracked && quantity < productDetails!.quantity) || !productDetails!.isStockTracked) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if ((productDetails!.isStockTracked && quantity > 1) || !productDetails!.isStockTracked) {
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
            {productDetails?.imageUrl ? (
              <img
                src={productDetails?.imageUrl}
                alt={productDetails?.name}
                className={styles.productImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <p>No Image</p>
              </div>
            )}
          </div>

          <div className={styles.detailsContainer}>
            <h1 className={styles.productName}>{productDetails?.name}</h1>
            {productDetails?.description && (
              <p className={styles.description}>{productDetails?.description}</p>
            )}
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
                disabled={(productDetails!.isStockTracked && quantity == 0)}
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
        <StickyCartButton />
      </div>
    ) : null

  );
};
