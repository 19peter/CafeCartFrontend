import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { useNotification } from '../../../hooks/useNotification';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { addToCart } from '../../../services/cartService';
import type { Product } from '../../../shared/types/product/ProductTypes';
import { getVendorProduct } from '../../../services/shopProductService';
import { StickyCartButton } from '../../../Components/StickyCartButton/StickyCartButton';
import { ProductAdditionGroups } from './ProductAdditionGroups';

interface LocationState {
  state: { vendorShopId: number };
}

export const ProductDetail = () => {
  const location = useLocation() as unknown as LocationState;
  const { vendorShopId } = location.state;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState<Product>();
  const [selectedSize, setSelectedSize] = useState<{ id: number; size: string }>();
  const [selectedAdditions, setSelectedAdditions] = useState<Record<number, number[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useNotification();
  const { isAuthenticated, setOpenAuthModal } = useCustomerAuth();
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchLatestStock = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getVendorProduct({
          vendorShopId: Number(vendorShopId),
          productId: Number(productId),
        });
        setProductDetails(data);
        if (data && data.options && data.options.length > 0) {
          const firstAvailable = data.options.find((o: any) => !o.isDeleted);
          if (firstAvailable) {
            setSelectedSize({ id: firstAvailable.id!, size: firstAvailable.size });
          }
        }
      } catch (err) {
        showError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestStock();
  }, [productId, vendorShopId]);

  const handleAdditionToggle = (groupId: number, additionId: number, maxSelectable: number) => {
    setSelectedAdditions((prev) => {
      const groupAdditions = prev[groupId] || [];
      const isSelected = groupAdditions.includes(additionId);

      if (isSelected) {
        return {
          ...prev,
          [groupId]: groupAdditions.filter((id) => id !== additionId),
        };
      } else {
        if (maxSelectable === 1) {
          return {
            ...prev,
            [groupId]: [additionId],
          };
        } else if (groupAdditions.length < maxSelectable) {
          return {
            ...prev,
            [groupId]: [...groupAdditions, additionId],
          };
        }
      }
      return prev;
    });
  };

  const calculateTotalPrice = () => {
    if (!productDetails) return 0;

    const selectedOption = productDetails.options?.find(
      (o) => o.size === (selectedSize?.size || productDetails.options?.[0]?.size)
    );
    const sizePrice = selectedOption?.price || 0;

    let additionsPrice = 0;
    if (productDetails.additionGroups) {
      productDetails.additionGroups.forEach((group) => {
        const selectedIds = selectedAdditions[group.id] || [];
        selectedIds.forEach((id) => {
          const addition = group.additions.find((a) => a.id === id);
          if (addition) {
            additionsPrice += addition.price;
          }
        });
      });
    }

    return sizePrice + additionsPrice;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }
    if (!productDetails || (productDetails.isStockTracked && productDetails.quantity === 0)) return;

    // Note: additionIds are not yet handled by cartService as per instructions
    const res: { status: number; message: string } = await addToCart({
      shopId: Number(vendorShopId),
      quantity,
      productOptionId: selectedSize?.id,
    });

    if (res.status !== 200) {
      showError(res.message);
    } else {
      showSuccess(`${quantity} ${productDetails.name} added to cart!`);
      setQuantity(1);
    }
  };

  const increaseQuantity = () => {
    if (
      (productDetails!.isStockTracked && quantity < productDetails!.quantity) ||
      !productDetails!.isStockTracked
    ) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (!productDetails) return null;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <span>&larr;</span> Back to Menu
      </button>

      <div className={styles.productContainer}>
        {/* Left Column: Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {productDetails.imageUrl ? (
              <img
                src={productDetails.imageUrl}
                alt={productDetails.name}
                className={styles.productImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>No Image</div>
            )}
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className={styles.detailsContainer}>
          <div className={styles.infoSection}>
            <span className={styles.category}>{productDetails.categoryName}</span>
            <h1 className={styles.productName}>{productDetails.name}</h1>
            <div className={styles.stockStatus}>
              {productDetails.isAvailable ? (
                <span className={`${styles.stockBadge} ${styles.inStock}`}>
                  ● In Stock {productDetails.isStockTracked && `(${productDetails.quantity})`}
                </span>
              ) : (
                <span className={`${styles.stockBadge} ${styles.outOfStock}`}>● Out of Stock</span>
              )}
            </div>
            {productDetails.description && (
              <p className={styles.description}>{productDetails.description}</p>
            )}
          </div>

          <div className={styles.purchaseSection}>
            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Total Price</span>
              <span className={styles.price}>{calculateTotalPrice().toFixed(2)} EGP</span>
            </div>

            <div className={styles.optionsContainer}>
              {/* Size Selector */}
              {productDetails.options &&
                productDetails.options.filter((o) => !o.isDeleted).length > 0 &&
                !(
                  productDetails.options.filter((o) => !o.isDeleted).length === 1 &&
                  productDetails.options.find((o) => !o.isDeleted)?.size === 'DEFAULT'
                ) && (
                  <div className={styles.optionsSection}>
                    <label className={styles.optionLabel}>Choice of Size</label>
                    <div className={styles.sizeGrid}>
                      {productDetails.options
                        .filter((o) => !o.isDeleted)
                        .map((opt) => (
                          <button
                            key={opt.size}
                            className={`${styles.sizeButton} ${selectedSize?.size === opt.size ? styles.selectedSize : ''
                              }`}
                            onClick={() => setSelectedSize({ id: opt.id!, size: opt.size })}
                          >
                            {opt.size}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

              {/* Addition Groups Component */}
              {productDetails.additionGroups && productDetails.additionGroups.length > 0 && (
                <ProductAdditionGroups
                  groups={productDetails.additionGroups}
                  selectedAdditions={selectedAdditions}
                  onToggle={handleAdditionToggle}
                />
              )}
            </div>

            <div className={styles.actionSection}>
              <div className={styles.quantityAndAdd}>
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
                    disabled={productDetails.isStockTracked && quantity >= productDetails.quantity}
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
                  {productDetails.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StickyCartButton />
    </div>
  );
};
