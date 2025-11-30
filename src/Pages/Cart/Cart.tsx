import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';
import { addOneToCart, getCart, removeItemFromCart, removeOneFromCart } from '../../services/cartService';
import type { OrderSummary, CartSummary, OrderType, PaymentMethod } from '../../shared/types/cart/CartTypes';
import { useNotification } from '../../contexts/NotificationContext';
import { createOrder } from '../../services/ordersService';


interface CartItemProps {
  children: React.ReactNode;
}


const CartItem: React.FC<CartItemProps> = ({ children }) => (
  <div className="cart-item">
    {children}
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    deliveryLocation,
    orderType,
    paymentMethod,
    removeFromCartContext,
    addQuantityContext,
    removeQuantityContext,
    setOrderTypeContext,
    setPaymentMethodContext,
    clearCartContext,
    saveItemsToContext,
    setShopName
  } = useCart();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>();
  const [cartSummary, setCartSummary] = useState<CartSummary>();
  const { showError, showSuccess } = useNotification();

  const fetchCart = async () => {
    const res = await getCart({ orderType, paymentMethod, latitude: deliveryLocation.lat, longitude: deliveryLocation.lng });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    setCartSummary(res.data.cartSummary);
    setOrderSummary(res.data.orderSummary);
    saveItemsToContext(res.data.orderSummary?.items || []);
    setShopName(res.data.orderSummary?.shopName || '');

  };

  const currencyFormatter = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  });

  function formatCurrency(value: number) {
    if (value == null || Number.isNaN(value)) return currencyFormatter.format(0);
    return currencyFormatter.format(value);
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }

    fetchCart();
  }, [orderType, paymentMethod]);

  const handleOrderTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrderType = event.target.value as OrderType;
    await setOrderTypeContext(newOrderType);
    setLocationError(null);
  };

  const handlePaymentMethodChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPaymentMethod = event.target.value as PaymentMethod;
    setPaymentMethodContext(newPaymentMethod);
    setLocationError(null);
  };

  const handleAddOneToCart = async (id: number, shopId: number, cartItemId: number) => {
    const res = await addOneToCart({ productId: id, shopId });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    addQuantityContext(cartItemId);
    fetchCart();
  };

  const handleRemoveOneFromCart = async (id: number) => {
    const res = await removeOneFromCart({ cartItemId: id });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    removeQuantityContext(id);
    fetchCart();
  };

  const handleRemoveItemFromCart = async (id: number) => {
    const res = await removeItemFromCart({ cartItemId: id });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    removeFromCartContext(id);
    fetchCart();
  };

  const handleCreateOrder = async () => {
    const res = await createOrder({ orderType, paymentMethod, latitude: deliveryLocation.lat, longitude: deliveryLocation.lng });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    clearCartContext();
    showSuccess('Order created successfully');
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="cart-container">
      {cartSummary && !cartSummary.online && <h3 className="cart-shop-closed">Shop Is Closed</h3>}
      <h1 className="cart-title">Your <span className="cart-shop-name">{orderSummary?.shopName}</span> Order</h1>

      {/* Order Type Selection */}
      {items.length > 0 && (
        <div className="form-group">
          <label htmlFor="order-type">Order Type</label>
          <select
            id="order-type"
            value={orderType}
            onChange={(e) => handleOrderTypeChange(e as any)}
            className="form-control"
          >
            <option value="IN_HOUSE">In House</option>
            <option value="PICKUP">Pickup</option>
            {cartSummary?.deliveryAvailable && <option value="DELIVERY">Delivery</option>}
          </select>
          {locationError && (
            <div className="error-message">
              {locationError}
            </div>
          )}
        </div>
      )}

      {/* Cart Items */}
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <>

              <CartItem key={item.id}>
                <div className="item-details">
                  <h3 className="item-name">{item.productName}</h3>
                  <p className="item-price">${item.unitPrice.toFixed(2)} each</p>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleRemoveOneFromCart(item.id)}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleAddOneToCart(item.productId, cartSummary!.shopId, item.id)}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <span className="item-total">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleRemoveItemFromCart(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              </CartItem>
            </>
          ))
        )}
      </div>

      {items.length > 0 && (
        <>
          {/* Payment Method */}
          <div className="form-group">
            <label htmlFor="payment-method">Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePaymentMethodChange(e)}
              className="form-control"
            >
              <option value="CASH">Cash on Delivery</option>
              {cartSummary?.onlinePaymentAvailable && <option value="CREDIT_CARD">Online Payment</option>}
            </select>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            {orderSummary ? (
              <>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderSummary.subTotal)}</span>
                </div>

                {orderSummary.deliveryFee != null && orderSummary.deliveryFee != 0  && (
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(orderSummary.deliveryFee)}</span>
                  </div>
                )}

                {orderSummary.transactionFee != null && orderSummary.transactionFee != 0 && (
                  <div className="summary-row">
                    <span>Transaction Fee</span>
                    <span>{formatCurrency(orderSummary.transactionFee)}</span>
                  </div>
                )}

                <div className="divider" />
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>

                <button
                  className={`submit-btn 
                    ${isLoading || items.length === 0 ? 'disabled' : ''}
                    ${!cartSummary?.online ? 'offline' : ''}`}
                  onClick={() => handleCreateOrder()}
                  disabled={!cartSummary?.online || isLoading || items.length === 0}
                  title={!cartSummary?.online ? 'Shop Is Closed' : ''}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : paymentMethod === 'CREDIT_CARD' 
                      ? 'Proceed to Payment' 
                      : 'Place Order'}
                </button>
                
              </>
            ) : (
              <p className="empty-summary">No items in cart</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
